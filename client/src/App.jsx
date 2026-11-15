
import { useState, useRef } from "react";
import axios from "axios";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  FileText,
  MessageCircle,
  Upload,
  Sparkles,
  Send,
  Loader2,
  Download,
  Copy,
  Check,
  Trash2,
  FileUp,
  Brain,
  Menu,
  X,
  ChevronRight,
  Bot,
  User,
  RefreshCw,
  ShieldCheck,
  Zap,
  BookMarked,
  AlertCircle
} from "lucide-react";

import MarkdownContent from "./components/MarkdownContent";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [file, setFile] = useState(null);
  const [documentText, setDocumentText] = useState("");
  const [notes, setNotes] = useState("");

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const fileInputRef = useRef(null);

  // Select a PDF
  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setSuccess("");

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a valid PDF file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
    setDocumentText("");
    setNotes("");
    setMessages([]);
  };

  // Upload PDF
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF document first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("pdf", file);

      const response = await axios.post(
        `${API}/pdf/upload`,
        formData
      );

      if (!response.data.text) {
        throw new Error("No text could be extracted from this PDF.");
      }

      setDocumentText(response.data.text);
      setSuccess("Your document is ready for learning!");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  // Generate AI notes
  const handleGenerateNotes = async () => {
    if (!documentText) {
      setError("Please upload a PDF before generating notes.");
      return;
    }

    try {
      setGenerating(true);
      setError("");
      setActivePage("notes");

      const response = await axios.post(
        `${API}/ai/notes`,
        {
          text: documentText
        }
      );

      setNotes(response.data.notes);
      setSuccess("Your AI study notes are ready!");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to generate AI notes."
      );
    } finally {
      setGenerating(false);
    }
  };

  // Chat with PDF
  const handleAskQuestion = async (e) => {
    e.preventDefault();

    if (!question.trim() || !documentText || chatLoading) {
      return;
    }

    const userQuestion = question.trim();

    setQuestion("");
    setError("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion
      }
    ]);

    try {
      setChatLoading(true);

      const response = await axios.post(
        `${API}/ai/chat`,
        {
          text: documentText,
          question: userQuestion
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.answer
        }
      ]);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to get an answer. Please try again."
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that question. Please try again."
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Copy notes
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(notes);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy notes.");
    }
  };

  // Download notes
  const handleDownload = () => {
    const blob = new Blob([notes], {
      type: "text/markdown;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "LectureMind-Study-Notes.md";
    link.click();

    URL.revokeObjectURL(url);
  };

  // Remove document
  const handleRemoveDocument = () => {
    setFile(null);
    setDocumentText("");
    setNotes("");
    setMessages([]);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag and drop
  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  // Navigation
  const navigate = (page) => {
    setActivePage(page);
    setMobileMenu(false);
    setError("");
  };

  const pageTitle = {
    dashboard: "Dashboard",
    notes: "AI Study Notes",
    chat: "Chat with PDF"
  };

  return (
    <div className="lm-app">

      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f7f8fc;
          font-family: 'DM Sans', sans-serif;
          color: #22243a;
        }

        button, input {
          font-family: inherit;
        }

        button {
          cursor: pointer;
        }

        button:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .lm-app {
          min-height: 100vh;
          background: #f7f8fc;
        }

        /* SIDEBAR */

        .lm-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 255px;
          background: #fff;
          border-right: 1px solid #eceef4;
          padding: 27px 19px;
          display: flex;
          flex-direction: column;
          z-index: 20;
        }

        .lm-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 7px;
          margin-bottom: 47px;
        }

        .lm-brand-icon {
          width: 43px;
          height: 43px;
          border-radius: 13px;
          display: grid;
          place-items: center;
          color: white;
          background: linear-gradient(135deg,#7060ed,#9b75ef);
          box-shadow: 0 5px 14px #7565e640;
        }

        .lm-brand-name {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -.7px;
          color: #24253d;
        }

        .lm-brand-name span {
          color: #7667e8;
        }

        .lm-menu-label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.4px;
          color: #a0a3b5;
          padding: 0 12px;
          margin-bottom: 13px;
        }

        .lm-nav {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .lm-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 13px 14px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: #777b90;
          font-size: 13px;
          font-weight: 600;
          text-align: left;
          transition: .2s;
        }

        .lm-nav-btn:hover {
          background: #f6f5ff;
          color: #7667e8;
        }

        .lm-nav-btn.active {
          color: #6d5de0;
          background: #f0edff;
          font-weight: 700;
        }

        .lm-nav-btn.active svg {
          color: #7667e8;
        }

        .lm-sidebar-bottom {
          margin-top: auto;
        }

        .lm-plan-card {
          background: linear-gradient(145deg,#292b54,#46417f);
          padding: 19px;
          border-radius: 14px;
          color: white;
          margin-bottom: 22px;
        }

        .lm-plan-card svg {
          color: #d0c5ff;
        }

        .lm-plan-card h4 {
          font-size: 13px;
          margin: 13px 0 7px;
        }

        .lm-plan-card p {
          font-size: 11px;
          color: #cecee9;
          line-height: 1.6;
          margin: 0;
        }

        .lm-sidebar-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          color: #85899b;
          font-size: 12px;
        }

        .lm-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #eae7ff;
          color: #7060df;
          font-weight: 800;
          flex-shrink: 0;
        }

        /* MAIN */

        .lm-main {
          margin-left: 255px;
          min-height: 100vh;
        }

        .lm-topbar {
          height: 83px;
          background: #fff;
          border-bottom: 1px solid #eceef4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 43px;
        }

        .lm-topbar-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .lm-topbar h2 {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 17px;
          margin: 0;
          font-weight: 700;
        }

        .lm-topbar p {
          font-size: 11px;
          color: #999caf;
          margin: 5px 0 0;
        }

        .lm-topbar-right {
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .lm-status {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          color: #32936b;
          background: #edfaf4;
          padding: 8px 12px;
          border-radius: 20px;
        }

        .lm-status-dot {
          width: 7px;
          height: 7px;
          background: #35b47c;
          border-radius: 50%;
        }

        .lm-profile {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 12px;
          font-weight: 600;
        }

        .lm-content {
          max-width: 1250px;
          padding: 35px 43px 55px;
          margin: auto;
        }

        /* HERO */

        .lm-hero {
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: space-between;
          align-items: center;
          min-height: 225px;
          padding: 37px 42px;
          border-radius: 18px;
          background: linear-gradient(115deg,#272950,#49417f 65%,#7865cf);
          color: white;
          margin-bottom: 30px;
        }

        .lm-hero::after {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          border: 1px solid #ffffff20;
          border-radius: 50%;
          right: 30px;
          top: -90px;
          box-shadow: 0 0 0 40px #ffffff08,
                      0 0 0 80px #ffffff05;
        }

        .lm-hero-content {
          position: relative;
          z-index: 1;
        }

        .lm-hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff18;
          padding: 7px 11px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 17px;
          color: #e4ddff;
        }

        .lm-hero h1 {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 29px;
          letter-spacing: -.9px;
          margin: 0 0 12px;
        }

        .lm-hero p {
          color: #d0cfe7;
          font-size: 13px;
          line-height: 1.7;
          margin: 0;
          max-width: 480px;
        }

        .lm-hero-art {
          position: relative;
          z-index: 1;
          margin-right: 45px;
          color: #ded7ff;
          opacity: .9;
        }

        /* SECTION */

        .lm-section {
          margin-top: 32px;
        }

        .lm-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .lm-section-heading h3 {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 16px;
          margin: 0;
        }

        .lm-section-heading p {
          font-size: 12px;
          color: #999caf;
          margin: 6px 0 0;
        }

        /* STATS */

        .lm-stats {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 17px;
        }

        .lm-stat-card {
          background: white;
          border: 1px solid #eceef4;
          padding: 19px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .lm-stat-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 11px;
        }

        .lm-stat-icon.purple {
          color: #7664e9;
          background: #f0edff;
        }

        .lm-stat-icon.blue {
          color: #4d91df;
          background: #edf5ff;
        }

        .lm-stat-icon.green {
          color: #36a37b;
          background: #eaf8f1;
        }

        .lm-stat-card h4 {
          font-size: 19px;
          margin: 0 0 4px;
        }

        .lm-stat-card p {
          font-size: 11px;
          color: #999caf;
          margin: 0;
        }

        /* UPLOAD */

        .lm-upload-card {
          background: white;
          border: 1px solid #e9eaf1;
          padding: 25px;
          border-radius: 15px;
        }

        .lm-dropzone {
          border: 2px dashed #dedcf1;
          background: #fafaff;
          border-radius: 12px;
          text-align: center;
          padding: 32px 20px;
          transition: .2s;
        }

        .lm-dropzone:hover {
          border-color: #8576e9;
          background: #f7f5ff;
        }

        .lm-dropzone.dragging {
          background: #f0edff;
          border-color: #7664e9;
        }

        .lm-upload-icon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          background: #efedff;
          color: #7664e9;
          border-radius: 15px;
          margin: 0 auto 15px;
        }

        .lm-dropzone h3 {
          font-size: 14px;
          margin: 0 0 8px;
        }

        .lm-dropzone p {
          color: #999caf;
          font-size: 12px;
          margin: 0 0 18px;
        }

        .lm-primary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          background: #7162e7;
          color: white;
          padding: 11px 19px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          transition: .2s;
        }

        .lm-primary-btn:hover {
          background: #5d4dcf;
          transform: translateY(-1px);
        }

        .lm-secondary-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: white;
          border: 1px solid #e6e6ef;
          color: #51546c;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .lm-selected-file {
          display: flex;
          align-items: center;
          gap: 13px;
          background: white;
          border: 1px solid #e7e7f0;
          padding: 14px;
          border-radius: 10px;
          max-width: 450px;
          margin: 20px auto 0;
          text-align: left;
        }

        .lm-file-icon {
          width: 40px;
          height: 40px;
          background: #fff0f0;
          color: #e15d65;
          border-radius: 9px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .lm-file-info {
          flex: 1;
          min-width: 0;
        }

        .lm-file-info strong {
          font-size: 12px;
          display: block;
          overflow-wrap: anywhere;
        }

        .lm-file-info span {
          font-size: 10px;
          color: #999caf;
          display: block;
          margin-top: 5px;
        }

        .lm-icon-btn {
          border: none;
          background: transparent;
          color: #999caf;
          padding: 7px;
          display: grid;
          place-items: center;
        }

        /* FEATURES */

        .lm-feature-grid {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 17px;
        }

        .lm-feature-card {
          background: white;
          border: 1px solid #e9eaf1;
          border-radius: 14px;
          padding: 22px;
          transition: .2s;
        }

        .lm-feature-card:hover {
          border-color: #c8c0fa;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px #35305d0b;
        }

        .lm-feature-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          margin-bottom: 17px;
        }

        .lm-feature-icon.notes {
          color: #7565e6;
          background: #f0edff;
        }

        .lm-feature-icon.chat {
          color: #478fda;
          background: #edf5ff;
        }

        .lm-feature-card h3 {
          font-size: 14px;
          margin: 0 0 9px;
        }

        .lm-feature-card p {
          color: #9093a5;
          font-size: 12px;
          line-height: 1.7;
          min-height: 42px;
          margin: 0 0 16px;
        }

        .lm-text-link {
          border: none;
          background: transparent;
          color: #7162e7;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0;
        }

        /* DOCUMENT */

        .lm-document {
          background: white;
          border: 1px solid #e8e9f0;
          border-radius: 14px;
          overflow: hidden;
        }

        .lm-document-header {
          padding: 21px 26px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eeeef4;
          gap: 15px;
        }

        .lm-document-header h3 {
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 16px;
          margin: 7px 0 0;
        }

        .lm-document-actions {
          display: flex;
          gap: 8px;
        }

        .lm-document-body {
          padding: 35px 42px;
          max-width: 950px;
          margin: auto;
          min-height: 250px;
        }

        .lm-markdown {
          font-size: 14px;
          line-height: 1.85;
          color: #45495d;
          overflow-wrap: anywhere;
        }

        .lm-markdown h1 {
          color: #242640;
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 27px;
          line-height: 1.4;
          margin: 0 0 23px;
          padding-bottom: 18px;
          border-bottom: 1px solid #e9e9f1;
        }

        .lm-markdown h2 {
          color: #34345f;
          font-family: 'Plus Jakarta Sans',sans-serif;
          font-size: 19px;
          margin: 32px 0 14px;
          padding-left: 12px;
          border-left: 4px solid #7868e8;
        }

        .lm-markdown h3 {
          color: #4b477c;
          font-size: 16px;
          margin: 24px 0 12px;
        }

        .lm-markdown p {
          margin: 0 0 14px;
        }

        .lm-markdown ul,
        .lm-markdown ol {
          padding-left: 24px;
          margin: 12px 0 20px;
        }

        .lm-markdown li {
          padding-left: 5px;
          margin-bottom: 8px;
        }

        .lm-markdown li::marker {
          color: #7868e8;
        }

        .lm-markdown strong {
          color: #303354;
          font-weight: 700;
        }

        .lm-markdown blockquote {
          margin: 20px 0;
          padding: 15px 19px;
          background: #f6f4ff;
          border-left: 4px solid #7969e8;
          border-radius: 0 8px 8px 0;
        }

        .lm-markdown table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 12px;
        }

        .lm-markdown th {
          background: #f1efff;
          color: #38365e;
          text-align: left;
        }

        .lm-markdown td,
        .lm-markdown th {
          padding: 11px;
          border: 1px solid #e7e7ef;
        }

        .lm-markdown hr {
          border: none;
          border-top: 1px solid #e8e8ef;
          margin: 24px 0;
        }

        .lm-markdown code {
          background: #f0eff8;
          color: #6959d1;
          padding: 3px 6px;
          border-radius: 4px;
        }

        /* CHAT */

        .lm-chat-layout {
          background: white;
          border: 1px solid #e9eaf1;
          border-radius: 14px;
          overflow: hidden;
        }

        .lm-chat-heading {
          padding: 20px 24px;
          border-bottom: 1px solid #eeeef4;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lm-chat-heading h3 {
          font-size: 14px;
          margin: 0 0 5px;
        }

        .lm-chat-heading p {
          font-size: 11px;
          color: #999caf;
          margin: 0;
        }

        .lm-chat-messages {
          padding: 25px;
          min-height: 350px;
          max-height: 520px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .lm-message {
          display: flex;
          gap: 12px;
          max-width: 90%;
        }

        .lm-message.user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .lm-message-avatar {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #efedff;
          color: #7162e7;
        }

        .lm-message.user .lm-message-avatar {
          background: #eaf3ff;
          color: #478fda;
        }

        .lm-message-content {
          min-width: 0;
        }

        .lm-message-content strong {
          font-size: 11px;
          display: block;
          margin-bottom: 8px;
        }

        .lm-message-bubble {
          padding: 13px 16px;
          background: #f6f6fa;
          border-radius: 4px 12px 12px 12px;
          font-size: 13px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .lm-message.user .lm-message-bubble {
          background: #efedff;
          border-radius: 12px 4px 12px 12px;
        }

        .lm-message-bubble .lm-markdown {
          font-size: 13px;
        }

        .lm-chat-form {
          display: flex;
          align-items: center;
          gap: 10px;
          border-top: 1px solid #eeeef4;
          padding: 17px 20px;
        }

        .lm-chat-form input {
          flex: 1;
          min-width: 0;
          border: 1px solid #e7e7ef;
          border-radius: 9px;
          padding: 13px 15px;
          font-size: 12px;
          outline: none;
        }

        .lm-chat-form input:focus {
          border-color: #8576e9;
        }

        .lm-send-btn {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border: none;
          border-radius: 9px;
          background: #7162e7;
          color: white;
        }

        /* EMPTY / STATUS */

        .lm-empty {
          text-align: center;
          padding: 45px 15px;
          color: #9295a7;
        }

        .lm-empty-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          margin: 0 auto 15px;
          border-radius: 17px;
          background: #f0edff;
          color: #7665e8;
        }

        .lm-empty h3 {
          color: #34364f;
          font-size: 14px;
          margin: 0 0 8px;
        }

        .lm-empty p {
          font-size: 12px;
          line-height: 1.6;
          margin: 0;
        }

        .lm-alert {
          padding: 12px 15px;
          display: flex;
          align-items: center;
          gap: 9px;
          border-radius: 9px;
          font-size: 12px;
          margin: 14px 0;
        }

        .lm-alert.error {
          background: #fff0f0;
          color: #c34646;
        }

        .lm-alert.success {
          background: #eaf9f1;
          color: #23805b;
        }

        .lm-loading {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #7565e6;
          font-size: 12px;
          padding: 17px;
        }

        .lm-spinner {
          animation: lm-spin 1s linear infinite;
        }

        @keyframes lm-spin {
          to { transform: rotate(360deg); }
        }

        .lm-page-footer {
          text-align: center;
          padding: 35px 10px 10px;
          color: #a1a4b4;
          font-size: 11px;
        }

        .lm-menu-toggle {
          display: none;
          border: none;
          background: transparent;
          color: #555;
        }

        @media(max-width: 1000px) {
          .lm-content {
            padding: 28px 25px;
          }

          .lm-topbar {
            padding: 0 25px;
          }
        }

        @media(max-width: 750px) {
          .lm-sidebar {
            transform: translateX(-100%);
            transition: .25s;
          }

          .lm-sidebar.open {
            transform: translateX(0);
            box-shadow: 10px 0 35px #00000018;
          }

          .lm-main {
            margin-left: 0;
          }

          .lm-menu-toggle {
            display: grid;
            place-items: center;
          }

          .lm-topbar {
            height: 70px;
            padding: 0 16px;
          }

          .lm-content {
            padding: 22px 15px;
          }

          .lm-hero {
            padding: 28px 23px;
          }

          .lm-hero h1 {
            font-size: 23px;
          }

          .lm-hero-art {
            display: none;
          }

          .lm-stats {
            grid-template-columns: 1fr;
          }

          .lm-feature-grid {
            grid-template-columns: 1fr;
          }

          .lm-document-body {
            padding: 22px 18px;
          }

          .lm-document-header {
            padding: 17px;
            align-items: flex-start;
            flex-direction: column;
          }

          .lm-message {
            max-width: 100%;
          }

          .lm-profile span {
            display: none;
          }
        }

      `}</style>

      {/* SIDEBAR */}

      <aside className={`lm-sidebar ${mobileMenu ? "open" : ""}`}>

        <div className="lm-brand">
          <div className="lm-brand-icon">
            <GraduationCap size={25} />
          </div>

          <div className="lm-brand-name">
            Lecture<span>Mind</span>
          </div>

          <button
            className="lm-menu-toggle"
            onClick={() => setMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="lm-menu-label">WORKSPACE</div>

        <nav className="lm-nav">

          <button
            className={`lm-nav-btn ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => navigate("dashboard")}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            className={`lm-nav-btn ${activePage === "notes" ? "active" : ""}`}
            onClick={() => navigate("notes")}
          >
            <FileText size={18} />
            AI Study Notes
          </button>

          <button
            className={`lm-nav-btn ${activePage === "chat" ? "active" : ""}`}
            onClick={() => navigate("chat")}
          >
            <MessageCircle size={18} />
            Chat with PDF
          </button>

        </nav>

        <div className="lm-sidebar-bottom">

          <div className="lm-plan-card">
            <Sparkles size={20} />

            <h4>Your AI Study Partner</h4>

            <p>
              Learn smarter with AI-generated notes
              and document-based conversations.
            </p>
          </div>

          <div className="lm-sidebar-footer">
            <div className="lm-avatar">S</div>
            <div>
              <strong>Student Workspace</strong>
              <div style={{ fontSize: 10, marginTop: 3 }}>
                Personal learning space
              </div>
            </div>
          </div>

        </div>

      </aside>

      {/* MAIN */}

      <main className="lm-main">

        {/* TOPBAR */}

        <header className="lm-topbar">

          <div className="lm-topbar-left">

            <button
              className="lm-menu-toggle"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <h2>{pageTitle[activePage]}</h2>
              <p>Workspace / {pageTitle[activePage]}</p>
            </div>

          </div>

          <div className="lm-topbar-right">

            <div className="lm-status">
              <span className="lm-status-dot" />
              AI Assistant Ready
            </div>

            <div className="lm-profile">
              <div className="lm-avatar">S</div>
              <span>Student</span>
            </div>

          </div>

        </header>

        <div className="lm-content">

          {/* GLOBAL ALERTS */}

          {error && (
            <div className="lm-alert error">
              <AlertCircle size={17} />
              {error}
              <button
                className="lm-icon-btn"
                onClick={() => setError("")}
              >
                <X size={15} />
              </button>
            </div>
          )}

          {success && (
            <div className="lm-alert success">
              <Check size={17} />
              {success}
              <button
                className="lm-icon-btn"
                onClick={() => setSuccess("")}
              >
                <X size={15} />
              </button>
            </div>
          )}

          {/* DASHBOARD */}

          {activePage === "dashboard" && (
            <>

              <section className="lm-hero">

                <div className="lm-hero-content">

                  <div className="lm-hero-tag">
                    <Sparkles size={13} />
                    YOUR PERSONAL AI LEARNING SPACE
                  </div>

                  <h1>Learn smarter, not harder.</h1>

                  <p>
                    Turn your study materials into intelligent
                    notes and interactive learning experiences.
                    Your personal AI tutor is ready.
                  </p>

                </div>

                <div className="lm-hero-art">
                  <Brain size={105} strokeWidth={1.1} />
                </div>

              </section>

              {/* STATS */}

              <section className="lm-stats">

                <div className="lm-stat-card">
                  <div className="lm-stat-icon purple">
                    <FileText size={21} />
                  </div>

                  <div>
                    <h4>{documentText ? "01" : "00"}</h4>
                    <p>Documents uploaded</p>
                  </div>
                </div>

                <div className="lm-stat-card">
                  <div className="lm-stat-icon blue">
                    <BookMarked size={21} />
                  </div>

                  <div>
                    <h4>{notes ? "01" : "00"}</h4>
                    <p>Notes generated</p>
                  </div>
                </div>

                <div className="lm-stat-card">
                  <div className="lm-stat-icon green">
                    <MessageCircle size={21} />
                  </div>

                  <div>
                    <h4>{messages.filter(m => m.role === "user").length}</h4>
                    <p>Questions asked</p>
                  </div>
                </div>

              </section>

              {/* UPLOAD */}

              <section className="lm-section">

                <div className="lm-section-heading">
                  <div>
                    <h3>Upload Study Material</h3>
                    <p>Start by uploading your PDF document.</p>
                  </div>

                  <ShieldCheck size={20} color="#37a17a" />
                </div>

                <div className="lm-upload-card">

                  <div
                    className="lm-dropzone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => {
                      if (!file) fileInputRef.current?.click();
                    }}
                  >

                    <div className="lm-upload-icon">
                      <FileUp size={25} />
                    </div>

                    <h3>
                      {file
                        ? "Your document is selected"
                        : "Drag and drop your PDF here"}
                    </h3>

                    <p>
                      {file
                        ? "Ready to upload and process your document"
                        : "Or browse files from your computer · PDF · Max 10 MB"}
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      hidden
                      onChange={(e) => {
                        handleFileChange(e.target.files[0]);
                        e.target.value = "";
                      }}
                    />

                    {!file && (
                      <button
                        className="lm-primary-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        <Upload size={16} />
                        Browse Files
                      </button>
                    )}

                    {file && (
                      <div
                        className="lm-selected-file"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="lm-file-icon">
                          <FileText size={21} />
                        </div>

                        <div className="lm-file-info">
                          <strong>{file.name}</strong>
                          <span>
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>

                        <button
                          className="lm-icon-btn"
                          onClick={handleRemoveDocument}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    )}

                    {file && (
                      <div style={{ marginTop: 16 }}>
                        <button
                          className="lm-primary-btn"
                          disabled={uploading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpload();
                          }}
                        >
                          {uploading
                            ? <><Loader2 size={15} className="lm-spinner" /> Uploading...</>
                            : <><Upload size={15} /> Upload Document</>}
                        </button>
                      </div>
                    )}

                    {documentText && (
                      <div className="lm-alert success">
                        <Check size={16} />
                        Document successfully processed and ready!
                      </div>
                    )}

                  </div>

                </div>

              </section>

              {/* AI TOOLS */}

              <section className="lm-section">

                <div className="lm-section-heading">
                  <div>
                    <h3>Your AI Learning Tools</h3>
                    <p>Choose how you want to study.</p>
                  </div>
                </div>

                <div className="lm-feature-grid">

                  <div className="lm-feature-card">

                    <div className="lm-feature-icon notes">
                      <FileText size={22} />
                    </div>

                    <h3>AI Notes Generator</h3>

                    <p>
                      Transform lengthy study materials into
                      organized, structured and easy-to-understand
                      examination notes.
                    </p>

                    <button
                      className="lm-text-link"
                      disabled={!documentText || generating}
                      onClick={handleGenerateNotes}
                    >
                      {generating
                        ? "Generating..."
                        : "Generate Notes"}
                      <ChevronRight size={16} />
                    </button>

                  </div>

                  <div className="lm-feature-card">

                    <div className="lm-feature-icon chat">
                      <MessageCircle size={22} />
                    </div>

                    <h3>Chat with PDF</h3>

                    <p>
                      Ask questions, understand difficult topics
                      and get contextual explanations directly
                      from your uploaded study material.
                    </p>

                    <button
                      className="lm-text-link"
                      disabled={!documentText}
                      onClick={() => navigate("chat")}
                    >
                      Start Conversation
                      <ChevronRight size={16} />
                    </button>

                  </div>

                </div>

              </section>

              {/* RECENT DOCUMENT */}

              <section className="lm-section">

                <div className="lm-section-heading">
                  <div>
                    <h3>Current Study Material</h3>
                    <p>Your active learning document.</p>
                  </div>
                </div>

                {documentText ? (
                  <div className="lm-upload-card">
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 13
                    }}>
                      <div className="lm-file-icon">
                        <FileText size={22} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{
                          fontSize: 13,
                          overflowWrap: "anywhere"
                        }}>
                          {file?.name || "Uploaded document"}
                        </strong>
                        <p style={{
                          color: "#9295a7",
                          fontSize: 11,
                          margin: "5px 0 0"
                        }}>
                          Ready for AI processing
                        </p>
                      </div>

                      <Check color="#35a578" size={20} />
                    </div>
                  </div>
                ) : (
                  <div className="lm-upload-card">
                    <div className="lm-empty">
                      <div className="lm-empty-icon">
                        <BookOpen size={25} />
                      </div>
                      <h3>No study material uploaded yet</h3>
                      <p>
                        Upload your first PDF to start learning
                        with LectureMind.
                      </p>
                    </div>
                  </div>
                )}

              </section>

            </>
          )}

          {/* NOTES PAGE */}

          {activePage === "notes" && (
            <>

              <section className="lm-hero">
                <div className="lm-hero-content">
                  <div className="lm-hero-tag">
                    <Sparkles size={13} />
                    INTELLIGENT NOTE GENERATION
                  </div>

                  <h1>Your knowledge, organized.</h1>

                  <p>
                    Generate structured examination notes
                    from your uploaded study material.
                  </p>
                </div>

                <div className="lm-hero-art">
                  <BookOpen size={95} strokeWidth={1.1} />
                </div>
              </section>

              {!documentText && (
                <div className="lm-upload-card">
                  <div className="lm-empty">
                    <div className="lm-empty-icon">
                      <Upload size={25} />
                    </div>

                    <h3>Upload a document first</h3>

                    <p>
                      Your PDF needs to be uploaded before
                      notes can be generated.
                    </p>

                    <button
                      className="lm-primary-btn"
                      style={{ marginTop: 18 }}
                      onClick={() => navigate("dashboard")}
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              )}

              {documentText && !notes && (
                <div className="lm-upload-card">
                  <div className="lm-empty">
                    <div className="lm-empty-icon">
                      <Sparkles size={25} />
                    </div>

                    <h3>Ready to generate your notes</h3>

                    <p>
                      Your document is uploaded.
                      Generate your personalized study notes.
                    </p>

                    <button
                      className="lm-primary-btn"
                      style={{ marginTop: 18 }}
                      disabled={generating}
                      onClick={handleGenerateNotes}
                    >
                      {generating
                        ? <><Loader2 size={16} className="lm-spinner" /> Generating...</>
                        : <><Sparkles size={16} /> Generate AI Notes</>}
                    </button>
                  </div>
                </div>
              )}

              {generating && (
                <div className="lm-loading">
                  <Loader2 size={19} className="lm-spinner" />
                  LectureMind is analyzing your document and
                  generating structured notes...
                </div>
              )}

              {notes && (
                <div className="lm-document">

                  <div className="lm-document-header">
                    <div>
                      <div className="lm-hero-tag" style={{
                        background: "#f0edff",
                        color: "#7060df",
                        marginBottom: 0
                      }}>
                        <Sparkles size={13} />
                        AI GENERATED DOCUMENT
                      </div>

                      <h3>Your Examination Notes</h3>
                    </div>

                    <div className="lm-document-actions">

                      <button
                        className="lm-secondary-btn"
                        onClick={handleCopy}
                      >
                        {copied
                          ? <Check size={15} />
                          : <Copy size={15} />}
                        {copied ? "Copied" : "Copy"}
                      </button>

                      <button
                        className="lm-primary-btn"
                        onClick={handleDownload}
                      >
                        <Download size={15} />
                        Download
                      </button>

                    </div>
                  </div>

                  <div className="lm-document-body">
                    <div className="lm-markdown">
                      <MarkdownContent content={notes} />
                    </div>
                  </div>

                </div>
              )}

            </>
          )}

          {/* CHAT PAGE */}

          {activePage === "chat" && (
            <>

              <section className="lm-hero">
                <div className="lm-hero-content">
                  <div className="lm-hero-tag">
                    <Brain size={13} />
                    YOUR PERSONAL AI TUTOR
                  </div>

                  <h1>Ask. Understand. Learn.</h1>

                  <p>
                    Have a conversation with your study material.
                    Ask questions and receive contextual explanations.
                  </p>
                </div>

                <div className="lm-hero-art">
                  <MessageCircle size={95} strokeWidth={1.1} />
                </div>
              </section>

              {!documentText ? (
                <div className="lm-upload-card">
                  <div className="lm-empty">
                    <div className="lm-empty-icon">
                      <FileText size={25} />
                    </div>

                    <h3>No document available</h3>

                    <p>
                      Upload a PDF to start chatting with
                      your personal AI tutor.
                    </p>

                    <button
                      className="lm-primary-btn"
                      style={{ marginTop: 18 }}
                      onClick={() => navigate("dashboard")}
                    >
                      Upload Study Material
                    </button>
                  </div>
                </div>
              ) : (
                <div className="lm-chat-layout">

                  <div className="lm-chat-heading">
                    <div className="lm-feature-icon chat"
                      style={{ margin: 0 }}>
                      <Bot size={22} />
                    </div>

                    <div>
                      <h3>LectureMind AI Tutor</h3>
                      <p>
                        Answering based on: {file?.name || "Uploaded document"}
                      </p>
                    </div>

                    <div style={{ marginLeft: "auto" }}>
                      <span className="lm-status">
                        <span className="lm-status-dot" />
                        Online
                      </span>
                    </div>
                  </div>

                  <div className="lm-chat-messages">

                    {messages.length === 0 && (
                      <div className="lm-empty">
                        <div className="lm-empty-icon">
                          <Sparkles size={25} />
                        </div>

                        <h3>Welcome to your AI study session!</h3>

                        <p>
                          Ask anything about your uploaded PDF.
                          I'll help you understand the concepts.
                        </p>

                        <div style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          gap: 8,
                          marginTop: 20
                        }}>
                          {[
                            "Summarize this document",
                            "Explain the important concepts",
                            "Give me exam questions"
                          ].map((suggestion) => (
                            <button
                              key={suggestion}
                              className="lm-secondary-btn"
                              onClick={() => setQuestion(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`lm-message ${message.role === "user" ? "user" : ""}`}
                      >

                        <div className="lm-message-avatar">
                          {message.role === "user"
                            ? <User size={16} />
                            : <Bot size={17} />}
                        </div>

                        <div className="lm-message-content">
                          <strong>
                            {message.role === "user"
                              ? "You"
                              : "LectureMind AI"}
                          </strong>

                          <div className="lm-message-bubble">
                            {message.role === "assistant" ? (
                              <div className="lm-markdown">
                                <MarkdownContent content={message.content} />
                              </div>
                            ) : (
                              message.content
                            )}
                          </div>
                        </div>

                      </div>
                    ))}

                    {chatLoading && (
                      <div className="lm-loading">
                        <Loader2 size={17} className="lm-spinner" />
                        AI is thinking...
                      </div>
                    )}

                  </div>

                  <form
                    className="lm-chat-form"
                    onSubmit={handleAskQuestion}
                  >

                    <input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask anything about your study material..."
                      disabled={chatLoading}
                    />

                    <button
                      className="lm-send-btn"
                      type="submit"
                      disabled={!question.trim() || chatLoading}
                    >
                      {chatLoading
                        ? <Loader2 size={18} className="lm-spinner" />
                        : <Send size={18} />}
                    </button>

                  </form>

                </div>
              )}

            </>
          )}

          {/* FOOTER */}

          <footer className="lm-page-footer">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              marginBottom: 7
            }}>
              <GraduationCap size={16} />
              <strong>LectureMind</strong>
            </div>

            AI-Powered Personalized Learning Platform · 2026

          </footer>

        </div>

      </main>

    </div>
  );
}

export default App;
