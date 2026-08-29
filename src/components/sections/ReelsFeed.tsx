import { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Heart, MessageCircle, Send, Plus, ChevronRight, ChevronLeft, Trash2, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { db, collection, query, orderBy, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from '../../lib/firebase';
import { AdminUploader } from '../admin/AdminUploader';

interface Media {
  url: string;
  type: 'image' | 'video';
}

interface Post {
  id: string;
  media: Media[];
  caption: string;
  timestamp: string;
  likes: number;
  audioUrl?: string;
  audioName?: string;
}

function ReelCard({ post, isVisible, onOpenComments }: { post: Post; isVisible: boolean; onOpenComments: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const lastTapTimeRef = useRef(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const backgroundAudioRef = useRef<HTMLVideoElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Listen for global mute events
  useEffect(() => {
    const handleGlobalMute = () => setIsMuted(true);
    const handleMuteOther = (e: CustomEvent) => {
      if (e.detail !== post.id) setIsMuted(true);
    };

    window.addEventListener('mute-reels-audio', handleGlobalMute);
    window.addEventListener('mute-other-reels', handleMuteOther as EventListener);

    return () => {
      window.removeEventListener('mute-reels-audio', handleGlobalMute);
      window.removeEventListener('mute-other-reels', handleMuteOther as EventListener);
    };
  }, [post.id]);

  // Intersection / Autoplay Logic
  useEffect(() => {
    // Determine the active video if any
    const activeMedia = post.media[currentSlide];
    const activeVideo = activeMedia?.type === 'video' ? videoRefs.current[currentSlide] : null;
    const bgAudio = backgroundAudioRef.current;

    if (isVisible) {
      if (bgAudio) {
        bgAudio.play().catch(() => {});
        if (!isMuted) {
          window.dispatchEvent(new CustomEvent('pause-global-audio'));
        }
      }
      if (activeVideo) {
        activeVideo.play().catch(() => {});
      }
    } else {
      if (bgAudio) bgAudio.pause();
      if (activeVideo) activeVideo.pause();
    }

    // Pause all non-active videos
    videoRefs.current.forEach((vid, idx) => {
      if (vid && idx !== currentSlide) vid.pause();
    });

  }, [isVisible, currentSlide, post.media, isMuted]);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 300) {
      if (!isLiked) toggleLike();
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 1000);
    }
    lastTapTimeRef.current = now;
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isMuted) {
      // Unmuting
      setIsMuted(false);
      window.dispatchEvent(new CustomEvent('pause-global-audio'));
      window.dispatchEvent(new CustomEvent('mute-other-reels', { detail: post.id }));
      
      // Explicitly call play in the click handler to satisfy iOS Safari restrictions
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.muted = false;
        backgroundAudioRef.current.play().catch(() => {});
      }
      
      const activeVideo = videoRefs.current[currentSlide];
      if (activeVideo) {
        activeVideo.muted = false;
        activeVideo.play().catch(() => {});
      }
    } else {
      setIsMuted(true);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleDelete = async () => {
    const password = prompt("Enter the Secret Admin Code to delete this post:");
    if (password === 'vedrag') {
      try {
        await deleteDoc(doc(db, 'posts', post.id));
      } catch (err) {
        console.error("Error deleting post:", err);
        alert("Failed to delete post.");
      }
    } else if (password !== null) {
      alert("Incorrect password!");
    }
  };

  const scrollNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (carouselRef.current && currentSlide < post.media.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      carouselRef.current.scrollTo({
        left: carouselRef.current.clientWidth * nextSlide,
        behavior: 'smooth'
      });
    }
  };

  const scrollPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (carouselRef.current && currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      carouselRef.current.scrollTo({
        left: carouselRef.current.clientWidth * prevSlide,
        behavior: 'smooth'
      });
    }
  };

  // Sync scroll state with active slide (if user manually swipes instead of clicking arrows)
  const handleScroll = () => {
    if (carouselRef.current) {
      const slideIndex = Math.round(carouselRef.current.scrollLeft / carouselRef.current.clientWidth);
      if (slideIndex !== currentSlide) {
        setCurrentSlide(slideIndex);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (backgroundAudioRef.current && backgroundAudioRef.current.duration) {
      setAudioProgress((backgroundAudioRef.current.currentTime / backgroundAudioRef.current.duration) * 100);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Claudelious Sajelious Jr.',
          text: post.caption,
          url: window.location.href,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const hasAudio = !!post.audioUrl || post.media.some(m => m.type === 'video');

  return (
    <div className="relative shrink-0 w-full h-[100dvh] md:w-[420px] md:h-[90vh] md:rounded-2xl overflow-hidden shadow-2xl bg-charcoal-950 md:border md:border-white/10 snap-center group">
      
      {post.audioUrl && (
        <video 
          ref={backgroundAudioRef} 
          src={post.audioUrl} 
          loop 
          muted={isMuted} 
          playsInline
          preload="auto" 
          onTimeUpdate={handleTimeUpdate}
          className="hidden"
        />
      )}

      {/* Media Carousel */}
      <div 
        ref={carouselRef}
        onScroll={handleScroll}
        onClick={handleDoubleTap}
        className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        
        {post.media.map((media, index) => (
          <div key={index} className="w-full h-full shrink-0 snap-center relative bg-charcoal-950 flex items-center justify-center overflow-hidden">
            {media.type === 'image' ? (
              <img 
                src={media.url} 
                alt={`${post.caption.substring(0, 20)}...`}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-[20000ms] ease-out",
                  isVisible ? "scale-110" : "scale-100"
                )}
              />
            ) : (
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                src={media.url}
                muted={post.audioUrl ? true : isMuted} // Force mute video if custom audio is playing
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Double Tap Heart Animation */}
      <AnimatePresence>
        {showHeartAnim && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <Heart size={120} className="fill-white text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.8)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soft Gradient Overlay for Text Readability - Only on bottom half */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Carousel Navigation Arrows */}
      {post.media.length > 1 && (
        <>
          {currentSlide > 0 && (
            <button onClick={scrollPrev} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10">
              <ChevronLeft size={16} />
            </button>
          )}
          {currentSlide < post.media.length - 1 && (
            <button onClick={scrollNext} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10">
              <ChevronRight size={16} />
            </button>
          )}
        </>
      )}

      {/* Audio Controls (Mute/Unmute) */}
      {hasAudio && (
        <button 
          onClick={toggleMute}
          className="absolute top-4 right-4 z-20 p-4 md:p-2 rounded-full bg-black/60 md:bg-black/40 backdrop-blur-md text-white md:text-white/90 hover:bg-black/80 transition-colors border border-white/20 md:border-white/10 shadow-xl"
        >
          {isMuted ? <VolumeX size={24} className="md:w-[18px] md:h-[18px]" /> : <Volume2 size={24} className="md:w-[18px] md:h-[18px]" />}
        </button>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 pb-10 md:pb-6 flex flex-col justify-end z-20 pointer-events-none">
        
        {/* Indicators */}
        {post.media.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mb-4 pointer-events-auto">
            {post.media.map((_, idx) => (
              <div 
                key={idx} 
                className={cn("h-1.5 rounded-full transition-all duration-300", currentSlide === idx ? "w-4 bg-gold-500" : "w-1.5 bg-white/40")}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 mb-3 pointer-events-auto">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/50 flex items-center justify-center overflow-hidden">
            <span className="font-serif text-xs font-bold text-gold-400">CSJ</span>
          </div>
          <span className="font-sans text-sm font-semibold text-white">sajelious.ai</span>
          <span className="text-xs text-white/50 ml-auto">{post.timestamp}</span>
        </div>

        <p className="text-sm text-white/90 line-clamp-3 mb-4 font-sans font-light pointer-events-auto">
          {post.caption}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <button 
            onClick={toggleLike}
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              isLiked ? "text-red-500" : "text-white/80 hover:text-white"
            )}
          >
            <Heart size={22} className={cn("transition-transform active:scale-75", isLiked ? "fill-red-500" : "")} />
            <span className="text-xs font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
          </button>
          
          <button 
            onClick={onOpenComments}
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
          >
            <MessageCircle size={22} />
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
          >
            <Send size={20} />
          </button>

          <button 
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-white/50 hover:text-red-500 transition-colors ml-auto"
            title="Delete Chronicle"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {/* Audio Track Marquee (if custom audio) */}
        {post.audioUrl && post.audioName && (
          <div className="mt-4 flex items-center gap-2 overflow-hidden pointer-events-auto text-gold-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 shrink-0 animate-pulse"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
            <div className="whitespace-nowrap animate-marquee text-[11px] uppercase tracking-wider font-medium">
              {post.audioName} • {post.audioName}
            </div>
            <style>{`
              @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
              .animate-marquee { animation: marquee 10s linear infinite; }
            `}</style>
          </div>
        )}
      </div>

      {/* Cinematic Audio Progress Bar */}
      {hasAudio && (
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/10 z-30">
          <div className="h-full bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.8)] transition-all duration-200" style={{ width: `${audioProgress}%` }} />
        </div>
      )}
    </div>
  );
}

// --- Comments Drawer Component ---
interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: any;
}

function CommentsDrawer({ postId, onClose }: { postId: string; onClose: () => void }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, `posts/${postId}/comments`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `posts/${postId}/comments`), {
        text: newComment.trim(),
        author: authorName.trim() || 'Anonymous',
        createdAt: serverTimestamp()
      });
      setNewComment('');
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60]"
      />
      <motion.div 
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute bottom-0 inset-x-0 h-[70vh] md:h-[60vh] md:max-w-md md:mx-auto bg-charcoal-900 rounded-t-3xl shadow-2xl z-[70] flex flex-col border-t border-white/10"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-serif text-lg text-white">Comments</h3>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors bg-white/5 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {loading ? (
            <div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-gold-500" /></div>
          ) : comments.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-white/40 font-serif">No comments yet. Be the first!</div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-500/20 flex shrink-0 items-center justify-center text-gold-500 font-bold text-xs uppercase">
                  {comment.author.charAt(0)}
                </div>
                <div>
                  <span className="text-xs text-white/50 font-medium block mb-0.5">{comment.author}</span>
                  <p className="text-sm text-white/90">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-charcoal-950 rounded-t-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Your name (optional)" 
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              className="bg-transparent border-b border-white/10 px-2 py-1 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors"
            />
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                required
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors"
              />
              <button 
                type="submit" 
                disabled={isSubmitting || !newComment.trim()}
                className="w-9 h-9 rounded-full bg-gold-500 text-charcoal-950 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="-ml-0.5" />}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}

export function ReelsFeed() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [selectedReelId, setSelectedReelId] = useState<string | null>(null);



  // Fetch posts from Firebase
  useEffect(() => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedPosts = snapshot.docs.map((doc: any) => {
          const data = doc.data();
          
          let timeString = 'Just now';
          if (data.createdAt) {
            let date = new Date();
            if (typeof data.createdAt.toDate === 'function') {
              date = data.createdAt.toDate();
            } else if (data.createdAt.seconds) {
              date = new Date(data.createdAt.seconds * 1000);
            } else {
              date = new Date(data.createdAt);
            }
            
            const now = new Date();
            const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
            if (diffInHours === 0) timeString = 'Recently';
            else if (diffInHours < 24) timeString = `${diffInHours} hours ago`;
            else timeString = `${Math.floor(diffInHours / 24)} days ago`;
          }

          // Backwards compatibility for single media posts
          const media = data.media || (data.url ? [{ url: data.url, type: data.type || 'image' }] : []);

          return {
            id: doc.id,
            media,
            caption: data.caption || '',
            timestamp: timeString,
            likes: data.likes || 0,
            audioUrl: data.audioUrl,
            audioName: data.audioName,
          } as Post;
        });
        
        setPosts(fetchedPosts);
        setLoading(false);
        setError('');
      }, (err) => {
        console.error("Firebase fetch error:", err);
        setLoading(false);
        setError('Could not connect to the archives. Please check your connection or database rules.');
      });

      return () => unsubscribe();
    } catch (err) {
      console.error("Initialization error:", err);
      setLoading(false);
      setError('System malfunction in the chronicles core.');
    }
  }, []);

  // Intersection Observer for autoplay functionality inside Modal
  useEffect(() => {
    if (!selectedReelId) {
      setVisibleItems(new Set());
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleItems((prev) => {
          const newVisible = new Set(prev);
          entries.forEach((entry) => {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              if (entry.isIntersecting) {
                newVisible.add(id);
              } else {
                newVisible.delete(id);
              }
            }
          });
          return newVisible;
        });
      },
      {
        root: scrollRef.current,
        threshold: 0.6,
      }
    );

    // Wait slightly for modal animation and DOM to mount
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.reel-card-wrapper');
      elements.forEach((el) => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [posts, selectedReelId]);

  // Scroll to selected reel on open
  useEffect(() => {
    if (selectedReelId && scrollRef.current) {
      // Need a tiny timeout to ensure DOM is ready after state change
      setTimeout(() => {
        const el = document.querySelector(`[data-id="${selectedReelId}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }, 10);
    }
  }, [selectedReelId]);

  return (
    <section 
      id="chronicles" 
      className="relative w-full h-[100dvh] bg-black flex flex-col overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-gold-900/10 blur-[120px] pointer-events-none rounded-[100%]" />

      {/* Floating Header Overlay */}
      <div className="absolute top-0 inset-x-0 pt-6 pb-12 px-6 md:px-12 z-50 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex items-end justify-between gap-4 max-w-7xl mx-auto pointer-events-auto">
          <div>
            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gold-500/80 mb-1 font-serif drop-shadow-md">Sacred Transmissions</h2>
            <div className="flex items-center gap-4">
              <h3 className="text-2xl md:text-4xl font-serif text-white tracking-wide drop-shadow-md">The Chronicles</h3>
              <button 
                onClick={() => setIsUploaderOpen(true)}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gold-500/30 text-gold-500 flex items-center justify-center hover:bg-gold-500/20 transition-colors bg-charcoal-900/80 backdrop-blur-md shadow-lg"
                title="Scribe a new chronicle"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full relative z-10 flex flex-col items-center">
        
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-white/50 font-serif tracking-widest text-xl pt-32">Loading the archives...</div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center text-red-500/80 pt-32">{error}</div>
        ) : posts.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-white/40 font-serif tracking-widest text-xl pt-32">
            No sacred transmissions have been made yet.
          </div>
        ) : null}

        {/* Unified Profile Grid (Mobile & Desktop) */}
        <div className="grid grid-cols-3 gap-1 md:gap-4 max-w-4xl mx-auto pt-32 pb-12 w-full px-1 md:px-4 overflow-y-auto z-20">
          {posts.map((post) => (
            <div 
              key={post.id} 
              onClick={() => setSelectedReelId(post.id)}
              className="aspect-square relative group cursor-pointer overflow-hidden bg-charcoal-900 border border-white/5 md:rounded-md"
            >
              {post.media[0].type === 'video' ? (
                <video src={post.media[0].url} className="w-full h-full object-cover" />
              ) : (
                <img src={post.media[0].url} className="w-full h-full object-cover" />
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2">
                <Heart size={20} className="fill-white" />
                <span className="font-bold text-lg">{post.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {/* Mobile Comments Drawer */}
        {activeCommentsPostId && (
          <CommentsDrawer 
            postId={activeCommentsPostId} 
            onClose={() => setActiveCommentsPostId(null)} 
          />
        )}

        {/* Fullscreen Vertical Reels Viewer Modal */}
        {selectedReelId && (() => {
          const currentIndex = posts.findIndex(p => p.id === selectedReelId);
          return (
            <motion.div 
              initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] bg-black/95 backdrop-blur-xl flex justify-center"
          >
            {/* Highly Visible Close Button */}
            <button 
              onClick={() => setSelectedReelId(null)}
              className="absolute top-6 left-6 md:top-8 md:left-8 z-[9001] p-3 md:p-4 bg-charcoal-900/80 hover:bg-gold-500 hover:text-black border border-white/20 hover:border-gold-500 text-white rounded-full transition-all shadow-2xl backdrop-blur-md"
            >
              <X size={24} className="md:w-8 md:h-8" />
            </button>

            {/* Desktop Left/Right Navigation Arrows */}
            {currentIndex > 0 && (
              <button 
                onClick={() => setSelectedReelId(posts[currentIndex - 1].id)}
                className="hidden md:flex absolute left-10 top-1/2 -translate-y-1/2 z-[9001] p-4 text-white/50 hover:text-white transition-colors"
              >
                <ChevronLeft size={48} />
              </button>
            )}
            
            {currentIndex < posts.length - 1 && (
              <button 
                onClick={() => setSelectedReelId(posts[currentIndex + 1].id)}
                className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 z-[9001] p-4 text-white/50 hover:text-white transition-colors"
              >
                <ChevronRight size={48} />
              </button>
            )}

            {/* Vertical Swipe Feed Container inside Modal */}
            <div 
              ref={scrollRef}
              className="w-full md:w-[420px] h-[100dvh] overflow-y-auto overflow-x-hidden flex flex-col snap-y snap-mandatory scroll-smooth reels-container relative"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
              }}
            >
              <style>{`
                .reels-container::-webkit-scrollbar { display: none; }
              `}</style>

              {posts.map((post) => (
                <div 
                  key={post.id} 
                  data-id={post.id} 
                  className="w-full h-[100dvh] shrink-0 flex justify-center snap-center reel-card-wrapper md:py-6"
                >
                  <ReelCard 
                    post={post} 
                    isVisible={visibleItems.has(post.id)}
                    onOpenComments={() => setActiveCommentsPostId(post.id)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
          );
        })()}
      </AnimatePresence>

      <AdminUploader isOpen={isUploaderOpen} onClose={() => setIsUploaderOpen(false)} />
    </section>
  );
}
