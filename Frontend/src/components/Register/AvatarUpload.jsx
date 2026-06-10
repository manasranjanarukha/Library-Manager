import { AlertCircle, Upload, User } from "lucide-react";
export default function AvatarUpload({ previewUrl, error, onChange }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black p-3 sm:p-3.5">
      {/* Avatar circle */}
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-black bg-white sm:h-14 sm:w-14 ">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User
              className="h-6 w-6 text-slate-300 sm:h-7 sm:w-7"
              aria-hidden="true"
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-700">
          {previewUrl ? "Photo selected" : "Profile photo"}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">
          JPG or PNG · Max 5 MB · Optional
        </p>
        {error && (
          <p
            role="alert"
            className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-600"
          >
            <AlertCircle className="h-3 w-3" aria-hidden="true" /> {error}
          </p>
        )}
      </div>

      {/* Upload button */}
      <label
        htmlFor="profilePicture"
        className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-black bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 transition-all duration-150 hover:border-teal-600/30 hover:text-teal-700 active:scale-95 sm:px-4 sm:text-xs"
      >
        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
        {previewUrl ? "Change" : "Upload"}
      </label>
      <input
        id="profilePicture"
        type="file"
        name="profilePicture"
        accept="image/jpg,image/jpeg,image/png"
        onChange={onChange}
        className="sr-only"
      />
    </div>
  );
}
