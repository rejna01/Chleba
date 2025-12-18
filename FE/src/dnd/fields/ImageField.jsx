import { useState, useRef } from "react";
import Styles from "./ImageField.module.css";

export default function ImageField({ field, charId }) {
  const [imageUrl, setImageUrl] = useState(field.value ?? null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleUploadFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("id", charId);
    formData.append("nameOfField", field.id);

    try {
      setUploading(true);
      const res = await fetch("/api/fileUpload/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch("/api/uploads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: charId,
          nameOfField: field.id,
          value: "",
        }),
      });
      setImageUrl(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Drag & drop eventy
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleUploadFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = () => setDragging(true);
  const handleDragLeave = () => setDragging(false);

  return (
    <div className={Styles.container}>
      {imageUrl ? (
        <div className={Styles.imageWrapper}>
          <img src={imageUrl} alt="" style={{ width: "100%", height: "100%" }} />
          <button
            className={Styles.removeImage}
            onClick={handleDelete}
            title="Smazat obrázek"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className={`${Styles.uploadBox} ${dragging ? Styles.dragging : ""}`}
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <p>{uploading ? "Uploading..." : "Drag & drop image here or click to select"}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleUploadFile(e.target.files?.[0])}
            style={{ display: "none" }}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
};