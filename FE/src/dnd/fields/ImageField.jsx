import { useState } from "react";
import Styles from "./ImageField.module.css";

export default function ImageField({ field, charId }) {
  const [imageUrl, setImageUrl] = useState(field.value ?? null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
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
      // backend by měl vrátit URL nebo cestu k obrázku
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

  return (
    <div className={Styles.imageField}>
      {!imageUrl ? (
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
      ) : (
        <div
          className={Styles.imageWrapper}
          style={{ width: "100%", height: "100%" }}
        >
          <img
            src={imageUrl}
            alt=""
            style={{ width: "100%", height: "100%" }}
          />
          <button
            className={Styles.removeImage}
            onClick={handleDelete}
            title="Smazat obrázek"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
