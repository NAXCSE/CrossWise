import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { FileText, Download, Plus, Building, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { generatePDF } from '../utils/documentGenerator';

const DocumentsPage = () => {
  const { products, documents, addDocument, exporterDetails, updateExporterDetails } = useStore();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedDocTypes, setSelectedDocTypes] = useState<string[]>([]);
  const [exporterForm, setExporterForm] = useState(exporterDetails || {
    iec: '',
    ad_code: '',
    gst_lut: '',
    company_name: '',
    company_address: '',
    pan: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<string[]>([]);

  const documentTypes = [
    { id: 'commercial_invoice', label: 'Commercial Invoice', description: 'Detailed invoice for customs' },
    { id: 'packing_list', label: 'Packing List', description: 'List of goods and packaging details' },
    { id: 'shipping_bill', label: 'Shipping Bill', description: 'Indian customs export declaration' },
    { id: 'letter_of_undertaking', label: 'Letter of Undertaking', description: 'LUT for GST-free exports' },
    { id: 'certificate_of_origin', label: 'Certificate of Origin', description: 'Product origin certification' },
  ];

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleDocTypeToggle = (docType: string) => {
    setSelectedDocTypes(prev => 
      prev.includes(docType) 
        ? prev.filter(t => t !== docType)
        : [...prev, docType]
    );
  };

  const handleGenerateDocuments = async () => {
    if (!selectedProduct || selectedDocTypes.length === 0) return;

    setIsGenerating(true);
    updateExporterDetails(exporterForm);

    // Simulate document generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newDocs = selectedDocTypes.map(docType => ({
      id: uuidv4(),
      type: docType as any,
      product_id: selectedProduct.id,
      generated_at: new Date(),
      content: {
        product: selectedProduct,
        exporter: exporterForm,
        documentType: docType,
      },
    }));

    newDocs.forEach(doc => addDocument(doc));
    setGeneratedDocs(selectedDocTypes);
    setIsGenerating(false);

    // Reset after showing success
    setTimeout(() => {
      setGeneratedDocs([]);
      setSelectedDocTypes([]);
      setSelectedProductId('');
    }, 3000);
  };

  const handleDownloadDocument = (doc: any) => {
    const product = products.find(p => p.id === doc.product_id);
    if (!product || !exporterDetails) return;

    generatePDF({
      type: doc.type,
      product,
      exporter: exporterDetails,
      order: { quantity: 1 }, // Default quantity for document generation
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Documents</h1>
          <p className="text-gray-600">Generate compliant export documentation for your products</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document Generation Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Product</h2>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Choose a product...</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.product_name} - {product.destination_country}
                  </option>
                ))}
              </select>
              
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">HS Code:</span>
                      <div className="font-medium">{selectedProduct.hs_code}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Duty Rate:</span>
                      <div className="font-medium">{selectedProduct.duty_rate}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Exporter Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Exporter Details</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IEC Number</label>
                  <input
                    type="text"
                    value={exporterForm.iec}
                    onChange={(e) => setExporterForm(prev => ({ ...prev, iec: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter IEC number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">AD Code</label>
                  <input
                    type="text"
                    value={exporterForm.ad_code}
                    onChange={(e) => setExporterForm(prev => ({ ...prev, ad_code: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter AD code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST LUT</label>
                  <input
                    type="text"
                    value={exporterForm.gst_lut}
                    onChange={(e) => setExporterForm(prev => ({ ...prev, gst_lut: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter GST LUT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN</label>
                  <input
                    type="text"
                    value={exporterForm.pan}
                    onChange={(e) => setExporterForm(prev => ({ ...prev, pan: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter PAN number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={exporterForm.company_name}
                    onChange={(e) => setExporterForm(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter company name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                  <textarea
                    value={exporterForm.company_address}
                    onChange={(e) => setExporterForm(prev => ({ ...prev, company_address: e.target.value }))}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter complete company address"
                  />
                </div>
              </div>
            </motion.div>

            {/* Document Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Types</h2>
              <div className="space-y-3">
                {documentTypes.map((docType) => (
                  <label key={docType.id} className="cursor-pointer">
                    <div className={`border-2 rounded-lg p-4 transition-colors ${
                      selectedDocTypes.includes(docType.id)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedDocTypes.includes(docType.id)}
                          onChange={() => handleDocTypeToggle(docType.id)}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{docType.label}</div>
                          <div className="text-sm text-gray-600">{docType.description}</div>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Generation Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Status</h3>
              
              {generatedDocs.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Documents Generated!</span>
                  </div>
                  {generatedDocs.map(docType => (
                    <div key={docType} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-green-700">
                        {documentTypes.find(d => d.id === docType)?.label}
                      </span>
                      <button className="text-green-600 hover:text-green-800">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">Select a product and document types to generate export documents.</p>
                  <button
                    onClick={handleGenerateDocuments}
                    disabled={!selectedProduct || selectedDocTypes.length === 0 || isGenerating}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Generate Documents</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Generated Documents */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Library</h3>
              {documents.length === 0 ? (
                <div className="text-center py-6">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No documents generated yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.slice(-5).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {documentTypes.find(d => d.id === doc.type)?.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {doc.generated_at.toLocaleDateString()}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDownloadDocument(doc)}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;