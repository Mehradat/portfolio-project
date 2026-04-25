import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../config";

interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  keyFeatures: string[];
  techStack: string[];
  image: string;
  images: string[];
}

const categories = [
  "Music + Code Integration",
  "Full-Stack Development",
  "Front-End Showcase",
];

function EditProject() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Full-Stack Development"); // Default
  const [description, setDescription] = useState("");
  const [keyFeatures, setKeyFeatures] = useState("");
  const [techStack, setTechStack] = useState("");
  
  // Cover Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState("");

  // Gallery State
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [dragOverImageIndex, setDragOverImageIndex] = useState<number | null>(null);
  
  // Extract ID robustly handling potential trailing slashes
  const projectId = window.location.pathname.split("/").filter(Boolean).pop();

  // CHECK AUTH & FETCH
  useEffect(() => {
    const init = async () => {
      // 1. Check Auth
      try {
        const authRes = await fetch(`${API_URL}/api/check-auth`, { credentials: "include" });
        const authData = await authRes.json();
        if (!authData.isAuthenticated) {
          window.location.pathname = "/admin"; // Redirect if not logged in
          return;
        }
      } catch (e) {
        window.location.pathname = "/admin";
        return;
      }

      // 2. Fetch Project if auth ok
      if (!projectId) return;
      try {
        const res = await fetch(`${API_URL}/api/projects/${projectId}`);
        
        if (!res.ok) {
           throw new Error("Failed to fetch project");
        }
        
        const data = await res.json();
        
        if (data) {
          setProject(data);
          setTitle(data.title || "");
          setCategory(data.category || "");
          setDescription(data.description || "");
          setKeyFeatures(data.keyFeatures ? data.keyFeatures.join(", ") : "");
          setTechStack(data.techStack ? data.techStack.join(", ") : "");
          
          let loadedImages = Array.isArray(data.images)
            ? data.images.filter((img: string) => Boolean(img))
            : [];
          // Ensure cover image is part of the gallery list (for legacy data compatibility)
          if (data.image && !loadedImages.includes(data.image)) {
             loadedImages = [data.image, ...loadedImages];
          }
          
          setGalleryImages(loadedImages);
          setCurrentImage(loadedImages.length > 0 ? loadedImages[0] : "");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [projectId]);

  // Gallery Actions
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...galleryImages];
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setGalleryImages(newImages);
    
    // Update cover preview if the first image changed
    if (newImages.length > 0) {
      setCurrentImage(newImages[0]);
    }
  };

  const onGalleryDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  const onGalleryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverImageIndex !== index) {
      setDragOverImageIndex(index);
    }
  };

  const onGalleryDrop = (targetIndex: number) => {
    if (draggedImageIndex === null || draggedImageIndex === targetIndex) {
      setDraggedImageIndex(null);
      setDragOverImageIndex(null);
      return;
    }

    setGalleryImages((prev) => {
      const next = [...prev];
      const [dragged] = next.splice(draggedImageIndex, 1);
      next.splice(targetIndex, 0, dragged);
      setCurrentImage(next.length > 0 ? next[0] : "");
      return next;
    });

    setDraggedImageIndex(null);
    setDragOverImageIndex(null);
  };

  const onGalleryDragEnd = () => {
    setDraggedImageIndex(null);
    setDragOverImageIndex(null);
  };

  const removeGalleryImage = (index: number) => {
    const newImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(newImages);
    
    // Update cover preview
    if (newImages.length > 0) {
      setCurrentImage(newImages[0]);
    } else {
      setCurrentImage("");
    }
  };

  const handleNewGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));

      setNewGalleryFiles(prev => [...prev, ...files]);
      setNewGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeNewGalleryFile = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(newGalleryPreviews[index]); 

    setNewGalleryFiles(newGalleryFiles.filter((_, i) => i !== index));
    setNewGalleryPreviews(newGalleryPreviews.filter((_, i) => i !== index));
  };
  
  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      newGalleryPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newGalleryPreviews]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return;
    setSaving(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    
    // Convert comma-separated strings back to arrays
    const featuresArray = keyFeatures.split(",").map(item => item.trim()).filter(i => i);
    const stackArray = techStack.split(",").map(item => item.trim()).filter(i => i);
    
    formData.append("keyFeatures", JSON.stringify(featuresArray));
    formData.append("techStack", JSON.stringify(stackArray));
    formData.append("password", "123456"); 

    // Cover Image
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Gallery Logic
    // 1. Send Existing Images (Reordered/Filtered)
    formData.append("existingImages", JSON.stringify(galleryImages));

    // 2. Send New Gallery Files
    newGalleryFiles.forEach((file) => {
      formData.append("gallery", file);
    });

    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        alert("Project updated successfully!");
        // Navigate back to AdminPanel Project section after successful save.
        window.location.pathname = "/admin-panel";
      } else {
        alert("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Error updating project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!project) return <div className="text-center p-10">Project not found</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Header className="text-black" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit Project</h1>
            <button 
              onClick={() => window.location.pathname = "/admin-panel"}
              className="text-gray-500 hover:text-gray-700"
            >
              Back to Panel
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                 {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-4">
                 {/* Key Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Features (comma separated)</label>
                  <textarea
                    value={keyFeatures}
                    onChange={(e) => setKeyFeatures(e.target.value)}
                    rows={2}
                    placeholder="Feature 1, Feature 2"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma separated)</label>
                  <textarea
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    rows={2}
                    placeholder="React, Node.js"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* --- IMAGES SECTION --- */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Media Management</h3>
              
              {/* 1. Cover Image */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="block text-sm font-bold text-gray-700 mb-2">Main Cover Image</label>
                <div className="flex items-start gap-4 flex-wrap">
                  {currentImage ? (
                    <div className="relative group">
                      <img
                        src={currentImage}
                        alt="Current Cover"
                        className="w-32 h-32 object-cover rounded shadow-sm bg-white"
                        onError={() => setCurrentImage("")}
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No Cover</div>
                  )}
                  
                  <div className="flex-1 min-w-[200px]">
                    <p className="text-xs text-gray-500 mb-2">Upload a new file to replace the current cover image.</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) setImageFile(e.target.files[0]);
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Gallery Images Management */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Gallery Images (Reorder & Edit)</label>
                
                {galleryImages.length === 0 && (
                  <p className="text-sm text-gray-500 italic mb-2">No gallery images yet.</p>
                )}

                <div className="space-y-2 mb-4">
                  {galleryImages.map((imgUrl, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={() => onGalleryDragStart(index)}
                      onDragOver={(e) => onGalleryDragOver(e, index)}
                      onDrop={() => onGalleryDrop(index)}
                      onDragEnd={onGalleryDragEnd}
                      className={`flex items-center gap-3 p-2 bg-white border rounded shadow-sm cursor-grab active:cursor-grabbing ${
                        draggedImageIndex === index
                          ? "opacity-60 border-blue-300"
                          : dragOverImageIndex === index
                            ? "border-blue-400 ring-2 ring-blue-200"
                            : "border-gray-200"
                      }`}
                    >
                      <span className="text-gray-400 font-mono text-xs w-6 text-center">{index + 1}</span>
                      <img src={imgUrl} alt="Gallery" className="w-16 h-16 object-cover rounded bg-gray-100" />
                      
                      <div className="flex-1 truncate text-xs text-gray-500">{imgUrl.split('/').pop()}</div>
                      
                      <div className="flex gap-1">
                        <span className="p-1 px-2 bg-gray-100 rounded text-gray-500 text-xs select-none">↕ Drag</span>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="p-1 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs ml-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Add New Gallery Images */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <label className="block text-sm font-bold text-blue-900 mb-2">Add New Images to Gallery</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewGalleryFiles}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-blue-700 hover:file:bg-blue-50 mb-3"
                />
                
                {/* Preview New Files */}
                {newGalleryFiles.length > 0 && (
                  <div className="space-y-4">
                    {newGalleryFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm bg-white p-2 rounded border border-blue-200">
                         {/* Preview Thumbnail */}
                         <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                           <img 
                            src={newGalleryPreviews[idx]} 
                            alt="New Upload" 
                            className="w-full h-full object-cover"
                           />
                         </div>
                         
                         <div className="flex-1 min-w-0">
                           <p className="font-medium truncate">{file.name}</p>
                           <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                         </div>

                         <button 
                           type="button" 
                           onClick={() => removeNewGalleryFile(idx)}
                           className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1 bg-red-50 rounded"
                         >
                           Remove
                         </button>
                      </div>
                    ))}
                    <p className="text-xs text-blue-600 mt-2">* These images will be appended to the gallery after saving.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  saving ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {saving ? "Saving Changes..." : "Save All Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditProject;