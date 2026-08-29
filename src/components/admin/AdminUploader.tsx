import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Loader2, Music, Search } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp, query, getDocs } from '../../lib/firebase';

interface AudioTrack {
  id: string;
  name: string;
  url: string;
}

export function AdminUploader({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Audio Library State
  const [showAudioLibrary, setShowAudioLibrary] = useState(false);
  const [audioSearch, setAudioSearch] = useState('');
  const [audioLibrary, setAudioLibrary] = useState<AudioTrack[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<AudioTrack | null>(null);
  const [newAudioFile, setNewAudioFile] = useState<File | null>(null);
  const [newAudioName, setNewAudioName] = useState('');

  // Fetch Audio Library when opening
  useEffect(() => {
    if (showAudioLibrary) {
      const fetchAudios = async () => {
        try {
          const q = query(collection(db, 'audios'));
          const snapshot = await getDocs(q);
          const tracks = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data()
          } as AudioTrack));
          setAudioLibrary(tracks);
        } catch (err) {
          console.error("Failed to fetch audio library:", err);
        }
      };
      fetchAudios();
    }
  }, [showAudioLibrary]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError('Please select at least one media file.');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Upload all Media Files to Cloudinary
      const media = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'csj_uploads');

          const response = await fetch('https://api.cloudinary.com/v1_1/pqpfkjtt/auto/upload', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload media to Cloudinary');
          }

          const data = await response.json();
          const url = data.secure_url;
          const type = file.type.startsWith('video/') ? 'video' : 'image';
          
          return { url, type };
        })
      );

      // 2. Handle Audio
      let finalAudioUrl = selectedAudio?.url || null;
      let finalAudioName = selectedAudio?.name || null;

      if (newAudioFile && newAudioName && !selectedAudio) {
        // Upload new audio to Cloudinary
        const formData = new FormData();
        formData.append('file', newAudioFile);
        formData.append('upload_preset', 'csj_uploads');

        const response = await fetch('https://api.cloudinary.com/v1_1/pqpfkjtt/auto/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload audio to Cloudinary');
        }

        const data = await response.json();
        finalAudioUrl = data.secure_url;
        finalAudioName = newAudioName;

        // Save to Audio Library
        await addDoc(collection(db, 'audios'), {
          name: newAudioName,
          url: finalAudioUrl,
          createdAt: serverTimestamp(),
        });
      }

      // 3. Save Post to Firestore
      const postData: any = {
        media,
        caption,
        likes: 0,
        createdAt: serverTimestamp(),
      };

      if (finalAudioUrl) {
        postData.audioUrl = finalAudioUrl;
        postData.audioName = finalAudioName;
      }

      // Legacy fallback fields for backward compatibility
      postData.type = media[0].type;
      postData.url = media[0].url;

      await addDoc(collection(db, 'posts'), postData);

      setSuccess(true);
      resetState();
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setFiles([]);
    setCaption('');
    setSelectedAudio(null);
    setNewAudioFile(null);
    setNewAudioName('');
    setShowAudioLibrary(false);
  };

  const filteredAudios = audioLibrary.filter(a => a.name.toLowerCase().includes(audioSearch.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-charcoal-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl my-8"
          >
            <button
              onClick={() => {
                resetState();
                onClose();
              }}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-serif text-white mb-6">Scribe a Chronicle</h2>

            <form onSubmit={handleUpload} className="space-y-4">
              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Media (Select Multiple for Carousel)
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-gold-500/50 transition-colors bg-white/5 relative">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {files.length > 0 ? (
                    <span className="text-white font-medium truncate max-w-[200px]">
                      {files.length} file(s) selected
                    </span>
                  ) : (
                    <>
                      <Upload className="text-white/40 mb-2" />
                      <span className="text-white/60 text-sm">Click or drag files here</span>
                    </>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Caption</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What's on your mind, Sir Sajelious?"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-gold-500/50 transition-colors resize-none h-24"
                />
              </div>

              {/* Audio Library Section */}
              <div className="border border-white/10 rounded-xl p-4 bg-black/20">
                <div className="flex items-center justify-between mb-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/70">
                    <Music size={16} /> Background Music (Optional)
                  </label>
                  <button 
                    type="button"
                    onClick={() => setShowAudioLibrary(!showAudioLibrary)}
                    className="text-xs text-gold-500 hover:text-gold-400"
                  >
                    {showAudioLibrary ? "Cancel" : selectedAudio ? "Change" : "Add Music"}
                  </button>
                </div>

                {selectedAudio && !showAudioLibrary && (
                  <div className="text-sm text-gold-400 bg-gold-900/10 p-2 rounded flex justify-between items-center">
                    <span>🎵 {selectedAudio.name}</span>
                    <button type="button" onClick={() => setSelectedAudio(null)}><X size={14} /></button>
                  </div>
                )}
                
                {newAudioFile && !showAudioLibrary && (
                  <div className="text-sm text-gold-400 bg-gold-900/10 p-2 rounded flex justify-between items-center">
                    <span>🎵 Uploading: {newAudioName || newAudioFile.name}</span>
                    <button type="button" onClick={() => {setNewAudioFile(null); setNewAudioName('')}}><X size={14} /></button>
                  </div>
                )}

                {showAudioLibrary && (
                  <div className="space-y-4">
                    {/* Search Existing */}
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                      <input 
                        type="text"
                        placeholder="Search audio library..."
                        value={audioSearch}
                        onChange={(e) => setAudioSearch(e.target.value)}
                        className="w-full bg-charcoal-950 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:border-gold-500/50"
                      />
                    </div>
                    
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {filteredAudios.map(audio => (
                        <button
                          key={audio.id}
                          type="button"
                          onClick={() => {
                            setSelectedAudio(audio);
                            setNewAudioFile(null);
                            setShowAudioLibrary(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-sm text-white/90 truncate transition-colors"
                        >
                          {audio.name}
                        </button>
                      ))}
                      {filteredAudios.length === 0 && <p className="text-xs text-white/40 italic p-2">No tracks found.</p>}
                    </div>

                    <div className="border-t border-white/10 my-2 pt-2" />

                    {/* Upload New Audio */}
                    <div>
                      <p className="text-xs text-white/50 mb-2">Or upload a new track to the library:</p>
                      <input 
                        type="text" 
                        placeholder="Track Name (e.g. Sajelious Theme)"
                        value={newAudioName}
                        onChange={(e) => setNewAudioName(e.target.value)}
                        className="w-full bg-charcoal-950 border border-white/10 rounded-lg p-2 text-sm text-white mb-2"
                      />
                      <div className="relative border border-dashed border-white/20 rounded-lg p-3 text-center hover:border-gold-500/50 bg-white/5 transition-colors">
                        <input 
                          type="file" 
                          accept="audio/*"
                          onChange={(e) => {
                            setNewAudioFile(e.target.files?.[0] || null);
                            if (e.target.files?.[0] && !newAudioName) {
                              setNewAudioName(e.target.files[0].name.split('.')[0]);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <span className="text-xs text-white/60">
                          {newAudioFile ? newAudioFile.name : "Select Audio File"}
                        </span>
                      </div>
                      {newAudioFile && (
                        <button 
                          type="button"
                          onClick={() => setShowAudioLibrary(false)}
                          className="w-full mt-2 bg-gold-500/20 text-gold-500 rounded py-1 text-sm border border-gold-500/30"
                        >
                          Confirm New Track
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-green-400 text-sm">Transmission sent successfully!</p>}

              <button
                type="submit"
                disabled={isUploading || files.length === 0}
                className="w-full bg-gold-500 hover:bg-gold-400 text-charcoal-950 font-bold py-3 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isUploading ? <Loader2 className="animate-spin" /> : 'Upload Transmision'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
