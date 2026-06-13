import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { pdfjs } from "react-pdf";
import { GENRES } from "../../constants/geners";
import {
  Upload,
  FileText,
  Lock,
  AlertCircle,
  BookOpen,
  Send,
  FileEdit,
  X,
  Info,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { UserContext } from "../../context/UserContext";
import Field from "./Field";
import TextInput from "./TextInput";
import CoverUpload from "./CoverUpload";
import PdfUpload from "./PdfUpload";
import StatusToggle from "./StatusToggle";
import ReadOnlyPill from "./ReadOnlyPill";
import useBookForm from "../../hooks/useBookForm";

export default function BookForm({ mode = "add", bookId }) {
  const {
    formData,
    errors,
    previewUrl,
    isSubmitting,
    isEdit,
    handleChange,
    handleStatusChange,
    handleSubmit,
    user,
    isDraft,
  } = useBookForm({ mode, bookId });

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      aria-label={isEdit ? "Edit book form" : "Add new book form"}
      noValidate
    >
      {/* Global form error */}
      {errors._form && (
        <div
          role="alert"
          className="flex items-start gap-3 px-4 py-3 mb-6 rounded-xl border border-[#DC2626]/20 bg-[#DC2626]/5"
        >
          <AlertCircle
            className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-sm text-[#DC2626] font-medium">{errors._form}</p>
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1  md:grid-cols-[220px_1fr] sm:grid-cols-[220px_1fr] sm:w-full lg:grid-cols-[220px_1fr] gap-6 lg:gap-8">
        {/* ── LEFT: Cover + PDF ── */}
        <div className="flex flex-col gap-5">
          <Field
            label="Book cover"
            hint="Max 10 MB"
            error={errors.cover}
            required
          >
            <CoverUpload
              previewUrl={previewUrl}
              error={errors.cover}
              onChange={handleChange}
            />
          </Field>

          <Field
            label="Book file (PDF)"
            hint="Max 10 MB"
            error={errors.bookFile}
            required={!isEdit}
          >
            <PdfUpload
              file={formData.bookFile}
              pages={formData.pages}
              error={errors.bookFile}
              onChange={handleChange}
            />
          </Field>
        </div>

        {/* ── RIGHT: Text fields ── */}
        <div className="flex flex-col gap-5">
          {/* Title */}
          <Field label="Title" hint="2–40 chars" error={errors.title} required>
            <TextInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your book title like ‘The Great Gatsby’"
              error={errors.title}
              maxLength={40}
            />
          </Field>

          {/* Genre */}
          <Field label="Genre" error={errors.genre} required>
            <select
              id="genre"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              aria-invalid={errors.genre ? "true" : "false"}
              className={[
                "w-full sm:w-[26.5rem] md:w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#1E293B]",
                "outline-none transition-all duration-200 cursor-pointer",
                "focus:ring-2 focus:ring-[#0F766E]/25 focus:border-[#0F766E]",
                errors.genre ? "border-[#DC2626]/60" : "border-black",
              ].join(" ")}
            >
              <option value="">Select a genre…</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.genre && (
              <p
                role="alert"
                className="flex items-center gap-1 text-xs text-[#DC2626] font-medium"
              >
                <AlertCircle
                  className="w-3 h-3 flex-shrink-0"
                  aria-hidden="true"
                />
                {errors.genre}
              </p>
            )}
          </Field>

          {/* Description */}
          <Field
            label="Description"
            hint="Min 10 chars"
            error={errors.description}
            required
          >
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is your book about? like ‘A classic novel set in the Roaring Twenties…’"
              rows={4}
              aria-invalid={errors.description ? "true" : "false"}
              className={[
                "w-full sm:w-[26.5rem] md:w-full px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#1E293B]",
                "placeholder-[#94A3B8] outline-none transition-all duration-200 resize-none leading-relaxed",
                "focus:ring-2 focus:ring-[#0F766E]/25 focus:border-[#0F766E]",
                errors.description ? "border-[#DC2626]/60" : "border-black",
              ].join(" ")}
            />
          </Field>

          {/* Pages + Year — auto-detected, read-only */}
          <div className="grid grid-cols-2 gap-4 sm:w-[26.5rem] md:w-full ">
            <Field label="Pages" hint="Auto-detected">
              <ReadOnlyPill
                icon={Lock}
                value={formData.pages}
                placeholder="Upload PDF first"
              />
            </Field>
            <Field label="Published year" hint="Auto">
              <ReadOnlyPill
                icon={Lock}
                value={formData.publishedYear}
                placeholder="—"
              />
            </Field>
          </div>

          {/* ── Publication status toggle (new feature) ── */}
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#64748B]">
                Publication status
              </span>
            </div>
            <StatusToggle
              value={formData.status}
              onChange={handleStatusChange}
            />
          </div>

          {/* ── Action buttons ── */}
          <div className=" sm:w-[26.5rem] md:w-full flex items-center gap-3 pt-2 flex-wrap ">
            <Link
              to={`/authors/${user?._id}/books`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#64748B] hover:bg-slate-50 hover:text-[#1E293B] transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label="Cancel and go back"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className={[
                "flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl",
                "text-sm font-bold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer",
                isDraft
                  ? "bg-amber-400 hover:bg-amber-500 text-amber-900"
                  : "bg-[#0F766E] hover:bg-[#0d6560] text-white",
              ].join(" ")}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                    aria-hidden="true"
                  />
                  Uploading…
                </>
              ) : isDraft ? (
                <>
                  <FileEdit className="w-4 h-4" aria-hidden="true" />
                  Save draft
                </>
              ) : isEdit ? (
                <>
                  <FileEdit className="w-4 h-4" aria-hidden="true" />
                  Update book
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  Publish book
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
