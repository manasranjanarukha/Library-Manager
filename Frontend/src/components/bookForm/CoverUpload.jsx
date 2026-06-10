// Icons from lucide-react
import { AlertCircle, Upload } from "lucide-react";
export default function CoverUpload({ previewUrl, error, onChange }) {
  return (
    <div className="flex flex-col gap-3 md:w-[220px]">
      {/* Preview area */}
      <label
        htmlFor="cover"
        className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl border-1  border-black bg-slate-50 hover:border-[#0F766E]/40 hover:bg-[#0F766E]/3 transition-all duration-200 "
        style={{ aspectRatio: "2/3" }}
        aria-label="Upload book cover photo"
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Book cover preview"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl flex flex-col items-center justify-center gap-2">
              <Upload className="w-7 h-7 text-white" aria-hidden="true" />
              <span className="text-white text-xs font-semibold">
                Change cover
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#0F766E]/8 flex items-center justify-center mb-1">
              <Upload
                className="w-6 h-6 text-[#0F766E]/50"
                aria-hidden="true"
              />
            </div>
            <p className="text-sm font-semibold text-black">Upload cover</p>
            <p className="text-[11px] text-black leading-relaxed">
              JPG, JPEG or PNG
              <br />
              Recommended 400×600 px
            </p>
          </div>
        )}
        <input
          id="cover"
          type="file"
          name="cover"
          accept="image/jpg,image/jpeg,image/png"
          onChange={onChange}
          className="sr-only"
          aria-invalid={error ? "true" : "false"}
        />
      </label>

      {/* Upload button */}
      <label
        htmlFor="cover"
        className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border-1 border-black bg-white text-xs font-semibold text-black hover:border-[#0F766E]/30 hover:text-[#0F766E] transition-all duration-200 cursor-pointer active:scale-95"
      >
        <Upload className="w-3.5 h-3.5" aria-hidden="true" />
        {previewUrl ? "Change photo" : "Choose photo"}
      </label>

      {error && (
        <p
          role="alert"
          className="flex items-center gap-1 text-xs text-[#DC2626] font-medium"
        >
          <AlertCircle className="w-3 h-3" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
