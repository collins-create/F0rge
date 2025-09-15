import React, { useState } from "react";
import { Plus, X, Send, Download, Upload, Code, Eye, EyeOff, Zap, Settings, Image, Type, User, MessageSquare } from "lucide-react";


export default function Forge() {
  const [embed, setEmbed] = useState({
    title: "",
    description: "",
    color: "#5865F2",
    url: "",
    thumbnail: "",
    image: "",
    author: { name: "", icon_url: "" },
    footer: { text: "", icon_url: "" },
  });


  const [webhooks, setWebhooks] = useState([""]);
  const [jsonInput, setJsonInput] = useState("");
  const [activeTab, setActiveTab] = useState("builder");
  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const [sendingStatus, setSendingStatus] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(true);


  const templates = {
    announcement: {
      title: "System Update Available",
      description: "We've released a new version with enhanced security features and performance improvements. Update now to get the latest features.",
      color: "#3B82F6",
      author: { name: "System", icon_url: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=64&h=64&fit=crop&crop=face" },
      footer: { text: "Version 2.1.4 • Released just now" },
    },
    alert: {
      title: "Security Alert",
      description: "Unusual activity detected on your account. Please verify your identity to continue using our services safely.",
      color: "#EF4444",
      thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop",
      footer: { text: "Security Team • High Priority" },
    },
    success: {
      title: "Payment Processed Successfully",
      description: "Your subscription has been renewed. Thank you for your continued support. Your premium features are now active.",
      color: "#10B981",
      author: { name: "Billing", icon_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" },
      footer: { text: "Next billing cycle: March 15, 2024" },
    },
    feature: {
      title: "Introducing Dark Mode",
      description: "Experience a sleek new interface designed for extended usage. Switch between light and dark themes in your settings.",
      color: "#8B5CF6",
      image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&h=200&fit=crop",
      footer: { text: "Available now in Settings" },
    },
  };


  const colorPresets = [
    { name: "Discord", color: "#5865F2" },
    { name: "Success", color: "#10B981" },
    { name: "Warning", color: "#F59E0B" },
    { name: "Error", color: "#EF4444" },
    { name: "Purple", color: "#8B5CF6" },
    { name: "Pink", color: "#EC4899" },
    { name: "Indigo", color: "#6366F1" },
    { name: "Teal", color: "#14B8A6" },
  ];


  const applyTemplate = (name) => {
    if (templates[name]) {
      setEmbed({ ...embed, ...templates[name] });
      // If you want templates to fully overwrite, use: setEmbed({ ...templates[name] });
    }
  };


  const addWebhook = () => {
    setWebhooks([...webhooks, ""]);
  };


  const removeWebhook = (index) => {
    setWebhooks(webhooks.filter((_, i) => i !== index));
  };


  const updateWebhook = (index, value) => {
    const newWebhooks = [...webhooks];
    newWebhooks[index] = value;
    setWebhooks(newWebhooks);
  };


  const sendToWebhooks = async () => {
    const payload = {
      embeds: [
        {
          title: embed.title || undefined,
          description: embed.description || undefined,
          url: embed.url || undefined,
          color: parseInt(embed.color.replace("#", "0x")),
          thumbnail: embed.thumbnail ? { url: embed.thumbnail } : undefined,
          image: embed.image ? { url: embed.image } : undefined,
          author: embed.author.name
            ? {
                name: embed.author.name,
                icon_url: embed.author.icon_url || undefined,
              }
            : undefined,
          footer: embed.footer.text
            ? {
                text: embed.footer.text,
                icon_url: embed.footer.icon_url || undefined,
              }
            : undefined,
        },
      ],
    };


    const validWebhooks = webhooks.filter(w => w.trim());


    for (let i = 0; i < validWebhooks.length; i++) {
      const webhook = validWebhooks[i];
      setSendingStatus(prev => ({ ...prev, [i]: 'sending' }));


      try {
        const response = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });


        if (response.ok) {
          setSendingStatus(prev => ({ ...prev, [i]: 'success' }));
        } else {
          setSendingStatus(prev => ({ ...prev, [i]: 'error' }));
        }
      } catch (error) {
        setSendingStatus(prev => ({ ...prev, [i]: 'error' }));
      }


      setTimeout(() => {
        setSendingStatus(prev => ({ ...prev, [i]: null }));
      }, 3000);
    }
  };


  const loadFromJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.embeds && parsed.embeds.length > 0) {
        const e = parsed.embeds[0];
        setEmbed({
          ...embed,
          title: e.title || "",
          description: e.description || "",
          color: e.color ? `#${e.color.toString(16).padStart(6, "0")}` : "#5865F2",
          url: e.url || "",
          thumbnail: e.thumbnail?.url || "",
          image: e.image?.url || "",
          author: {
            name: e.author?.name || "",
            icon_url: e.author?.icon_url || "",
          },
          footer: {
            text: e.footer?.text || "",
            icon_url: e.footer?.icon_url || "",
          },
        });
        setJsonInput("");
        setActiveTab("builder");
      }
    } catch (err) {
      alert("Invalid JSON format");
    }
  };


  const exportJson = () => {
    const payload = {
      embeds: [
        {
          title: embed.title || undefined,
          description: embed.description || undefined,
          url: embed.url || undefined,
          color: parseInt(embed.color.replace("#", "0x")),
          thumbnail: embed.thumbnail ? { url: embed.thumbnail } : undefined,
          image: embed.image ? { url: embed.image } : undefined,
          author: embed.author.name
            ? {
                name: embed.author.name,
                icon_url: embed.author.icon_url || undefined,
              }
            : undefined,
          footer: embed.footer.text
            ? {
                text: embed.footer.text,
                icon_url: embed.footer.icon_url || undefined,
              }
            : undefined,
        },
      ],
    };


    const jsonStr = JSON.stringify(payload, null, 2);
    navigator.clipboard.writeText(jsonStr);


    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "embed.json";
    a.click();
    URL.revokeObjectURL(url);
  };


  const clearForm = () => {
    setEmbed({
      title: "",
      description: "",
      color: "#5865F2",
      url: "",
      thumbnail: "",
      image: "",
      author: { name: "", icon_url: "" },
      footer: { text: "", icon_url: "" },
    });
  };


  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`border-b backdrop-blur-xl sticky top-0 z-50 ${
        isDarkMode 
          ? 'bg-gray-900/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Forge
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Discord Embed Builder
                </p>
              </div>
            </div>
          </div>


          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-all ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {isDarkMode ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
            <button
              onClick={clearForm}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Clear
            </button>
            <button
              onClick={exportJson}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>


      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className={`grid ${previewCollapsed ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-5'} gap-8`}>
          {/* Main Content */}
          <div className={previewCollapsed ? 'col-span-1' : 'xl:col-span-3'}>
            {/* Tab Navigation */}
            <div className={`flex space-x-1 p-1 rounded-xl mb-6 ${
              isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'
            }`}>
              {[
                { id: 'builder', label: 'Builder', icon: Settings },
                { id: 'templates', label: 'Templates', icon: Zap },
                { id: 'json', label: 'JSON', icon: Code },
                { id: 'webhooks', label: 'Deploy', icon: Send },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === id
                      ? isDarkMode
                        ? 'bg-gray-700 text-white shadow-lg'
                        : 'bg-white text-gray-900 shadow-md'
                      : isDarkMode
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>


            {/* Tab Content */}
            <div className={`rounded-2xl backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-gray-800/30 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              {activeTab === 'builder' && (
                <div className="p-6 space-y-6">
                  {/* Content Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Type className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-semibold">Content</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <input
                          placeholder="Embed title"
                          value={embed.title}
                          onChange={(e) => setEmbed({ ...embed, title: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isDarkMode
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                      <div>
                        <textarea
                          placeholder="Embed description"
                          value={embed.description}
                          onChange={(e) => setEmbed({ ...embed, description: e.target.value })}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                            isDarkMode
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                      <div>
                        <input
                          placeholder="Title URL (optional)"
                          value={embed.url}
                          onChange={(e) => setEmbed({ ...embed, url: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isDarkMode
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>


                  {/* Color Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-5 h-5 rounded-full" style={{ backgroundColor: embed.color }}></div>
                      <h3 className="text-lg font-semibold">Appearance</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {colorPresets.map(({ name, color }) => (
                        <button
                          key={color}
                          onClick={() => setEmbed({ ...embed, color })}
                          className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                            embed.color === color
                              ? 'border-white shadow-lg'
                              : isDarkMode
                                ? 'border-gray-600 hover:border-gray-500'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        >
                          <div className="text-white text-xs font-medium">{name}</div>
                        </button>
                      ))}
                    </div>
                    <div className="flex space-x-3">
                      <input
                        type="color"
                        value={embed.color}
                        onChange={(e) => setEmbed({ ...embed, color: e.target.value })}
                        className="w-12 h-12 rounded-xl border-2 border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={embed.color}
                        onChange={(e) => setEmbed({ ...embed, color: e.target.value })}
                        className={`flex-1 px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode
                            ? 'bg-gray-700/50 border-gray-600 text-white'
                            : 'bg-white border-gray-200 text-gray-900'
                        }`}
                        placeholder="#5865F2"
                      />
                    </div>
                  </div>


                  {/* Media Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Image className="w-5 h-5 text-purple-500" />
                      <h3 className="text-lg font-semibold">Media</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <input
                        placeholder="Thumbnail URL"
                        value={embed.thumbnail}
                        onChange={(e) => setEmbed({ ...embed, thumbnail: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <input
                        placeholder="Main image URL"
                        value={embed.image}
                        onChange={(e) => setEmbed({ ...embed, image: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                  </div>


                  {/* Author & Footer */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="w-5 h-5 text-green-500" />
                      <h3 className="text-lg font-semibold">Author & Footer</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        placeholder="Author name"
                        value={embed.author.name}
                        onChange={(e) => setEmbed({ ...embed, author: { ...embed.author, name: e.target.value } })}
                        className={`px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <input
                        placeholder="Author icon URL"
                        value={embed.author.icon_url}
                        onChange={(e) => setEmbed({ ...embed, author: { ...embed.author, icon_url: e.target.value } })}
                        className={`px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <input
                        placeholder="Footer text"
                        value={embed.footer.text}
                        onChange={(e) => setEmbed({ ...embed, footer: { ...embed.footer, text: e.target.value } })}
                        className={`px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode
                          ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <input
                        placeholder="Footer icon URL"
                        value={embed.footer.icon_url}
                        onChange={(e) => setEmbed({ ...embed, footer: { ...embed.footer, icon_url: e.target.value } })}
                        className={`px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDarkMode
                            ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}


              {activeTab === 'templates' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(templates).map(([key, template]) => (
                      <button
                        key={key}
                        onClick={() => applyTemplate(key)}
                        className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-[1.02] group ${
                          isDarkMode
                            ? 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: template.color }}
                          ></div>
                          <h3 className="font-semibold capitalize">{key}</h3>
                        </div>
                        <p className={`text-sm line-clamp-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {template.description}
                        </p>
                        <div className={`mt-3 text-xs font-medium ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        } group-hover:underline`}>
                          Apply template →
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}


              {activeTab === 'json' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">JSON Import/Export</h3>
                  </div>
                  <textarea
                    placeholder="Paste Discord embed JSON here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    rows={12}
                    className={`w-full px-4 py-3 rounded-xl border font-mono text-sm transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      isDarkMode
                        ? 'bg-gray-900/50 border-gray-600 text-gray-300'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  />
                  <button
                    onClick={loadFromJson}
                    disabled={!jsonInput.trim()}
                    className="w-full px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Import from JSON
                  </button>
                </div>
              )}


              {activeTab === 'webhooks' && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Webhook URLs</h3>
                    <button
                      onClick={addWebhook}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>


                  <div className="space-y-3">
                    {webhooks.map((webhook, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          placeholder="https://discord.com/api/webhooks/..."
                          value={webhook}
                          onChange={(e) => updateWebhook(index, e.target.value)}
                          className={`flex-1 px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isDarkMode
                              ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                        {webhooks.length > 1 && (
                          <button
                            onClick={() => removeWebhook(index)}
                            className={`p-3 rounded-lg transition-all ${
                              isDarkMode
                                ? 'text-red-400 hover:bg-red-900/20'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        {sendingStatus[index] && (
                          <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                            sendingStatus[index] === 'sending' 
                              ? 'bg-blue-100 text-blue-800' 
                              : sendingStatus[index] === 'success' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {sendingStatus[index] === 'sending' ? 'Sending...' :
                             sendingStatus[index] === 'success' ? 'Sent!' : 'Failed'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>


                  <button
                    onClick={sendToWebhooks}
                    disabled={!webhooks.some(w => w.trim())}
                    className="w-full px-4 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Deploy to All Webhooks</span>
                  </button>
                </div>
              )}
            </div>
          </div>


          {/* Preview Panel */}
          {!previewCollapsed && (
            <div className="xl:col-span-2">
              <div className={`sticky top-24 rounded-2xl backdrop-blur-xl border overflow-hidden ${
                isDarkMode 
                  ? 'bg-gray-800/30 border-gray-700' 
                  : 'bg-white/70 border-gray-200'
              }`}>
                <div className={`px-4 py-3 border-b flex items-center justify-between ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-purple-500" />
                    <span className="font-medium text-sm">Live Preview</span>
                  </div>
                  <button
                    onClick={() => setPreviewCollapsed(true)}
                    className={`p-1 rounded transition-all ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                </div>


                <div className="p-6">
                  {/* Discord UI Mockup */}
                  <div className="bg-gray-900 rounded-xl p-4 space-y-3">
                    {/* Chat header */}
                    <div className="flex items-center space-x-3 pb-2 border-b border-gray-700">
                      <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                      <span className="text-gray-300 text-sm font-medium">#general</span>
                    </div>


                    {/* Bot message */}
                    <div className="flex space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-blue-400 font-medium text-sm">Forge Bot</span>
                          <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">BOT</span>
                          <span className="text-gray-500 text-xs">Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>


                        {/* Embed Preview */}
                        {(embed.title || embed.description || embed.image || embed.thumbnail || embed.author.name || embed.footer.text) ? (
                          <div className="max-w-lg">
                            <div 
                              className="border-l-4 pl-3 py-2 bg-gray-800/50 rounded-r-lg"
                              style={{ borderLeftColor: embed.color }}
                            >
                              {/* Author */}
                              {embed.author.name && (
                                <div className="flex items-center space-x-2 mb-2">
                                  {embed.author.icon_url && (
                                    <img 
                                      src={embed.author.icon_url} 
                                      className="w-5 h-5 rounded-full object-cover" 
                                      alt="author"
                                      onError={(e) => e.target.style.display = 'none'}
                                    />
                                  )}
                                  <span className="text-white text-sm font-medium">{embed.author.name}</span>
                                </div>
                              )}


                              <div className="flex justify-between items-start">
                                <div className="flex-1 pr-3">
                                  {/* Title */}
                                  {embed.title && (
                                    <div className={`text-blue-400 font-semibold mb-1 ${embed.url ? 'hover:underline cursor-pointer' : ''}`}>
                                      {embed.title}
                                    </div>
                                  )}


                                  {/* Description */}
                                  {embed.description && (
                                    <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                      {embed.description}
                                    </div>
                                  )}
                                </div>


                                {/* Thumbnail */}
                                {embed.thumbnail && (
                                  <img 
                                    src={embed.thumbnail} 
                                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                                    alt="thumbnail"
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                )}
                              </div>


                              {/* Main Image */}
                              {embed.image && (
                                <div className="mt-3">
                                  <img 
                                    src={embed.image} 
                                    className="rounded max-w-full h-auto"
                                    alt="embed image"
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                </div>
                              )}


                              {/* Footer */}
                              {embed.footer.text && (
                                <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-700">
                                  {embed.footer.icon_url && (
                                    <img 
                                      src={embed.footer.icon_url} 
                                      className="w-4 h-4 rounded object-cover" 
                                      alt="footer"
                                      onError={(e) => e.target.style.display = 'none'}
                                    />
                                  )}
                                  <span className="text-gray-400 text-xs">{embed.footer.text}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="max-w-lg p-8 border-2 border-dashed border-gray-600 rounded-lg text-center">
                            <MessageSquare className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">Start building your embed</p>
                            <p className="text-gray-500 text-xs mt-1">Fill out the form to see a live preview</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Collapsed preview button */}
          {previewCollapsed && (
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={() => setPreviewCollapsed(false)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
              >
                <Eye className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Footer */}
      <footer className={`border-t mt-16 ${
        isDarkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-white/50'
      } backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold">Forge</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Professional Discord embed builder
                </div>
              </div>
            </div>


            <div className={`flex space-x-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <a href="#" className="hover:text-blue-500 transition-colors">Documentation</a>
              <a href="#" className="hover:text-blue-500 transition-colors">API Reference</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}