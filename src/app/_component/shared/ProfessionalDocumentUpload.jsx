"use client";
import React from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";

const ProfessionalDocumentUpload = ({
  existingDocuments = [],
  newDocuments = [],
  documentTypes = [],
  selectedDocType,
  isEditing,
  onFileUpload,
  onRemoveNewDocument,
  onUpdateDocumentType,
  onDocumentTypeChange,
  getDocumentStatusIcon,
  getDocumentStatusText,
}) => {
  return (
    <div className="space-y-6">
      {/* Existing Documents */}
      {existingDocuments && existingDocuments.length > 0 && (
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center ml-2">
              <FileText className="h-4 w-4 text-white" />
            </div>
            الوثائق الحالية
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingDocuments.map((doc) => (
              <Card
                key={doc._id}
                className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 space-x">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        {getDocumentStatusIcon(doc.status)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">
                          {doc.docType}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          الحالة: {getDocumentStatusText(doc.status)}
                        </div>
                      </div>
                    </div>
                    {doc.fileUrl && (
                      <Button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 text-xs rounded-lg"
                        onClick={() => window.open(doc.fileUrl, "_blank")}
                      >
                        <Eye className="h-3 w-3 ml-1" />
                        عرض
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Documents */}
      {isEditing && (
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center ml-2">
              <Upload className="h-4 w-4 text-white" />
            </div>
            إضافة وثائق جديدة
          </h4>

          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="docType"
                    className="text-lg font-semibold text-gray-700 flex items-center"
                  >
                    <div className="w-2 h-6 bg-emerald-500 rounded-full ml-2"></div>
                    نوع الوثيقة
                  </Label>
                  <Select
                    value={selectedDocType}
                    onValueChange={onDocumentTypeChange}
                  >
                    <SelectTrigger className="form-input text-lg">
                      <SelectValue placeholder="اختر نوع الوثيقة" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="documents"
                    className="text-lg font-semibold text-gray-700 flex items-center"
                  >
                    <div className="w-2 h-6 bg-blue-500 rounded-full ml-2"></div>
                    اختيار الملفات
                  </Label>
                  <Input
                    id="documents"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={onFileUpload}
                    className="form-input text-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="text-sm text-gray-500 mt-2 bg-white/50 p-2 rounded-lg">
                    <strong>الملفات المدعومة:</strong> PDF, DOC, DOCX, JPG, PNG
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Documents Preview */}
          {newDocuments.length > 0 && (
            <div className="mt-6">
              <h5 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-5 h-5 bg-purple-500 rounded-lg flex items-center justify-center ml-2">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
                الملفات المحددة للرفع ({newDocuments.length})
              </h5>
              <div className="space-y-3">
                {newDocuments.map((docObj, index) => (
                  <Card
                    key={index}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3 space-x">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-gray-800">
                                {docObj.name}
                              </span>
                              <div className="text-xs text-gray-500">
                                {(docObj.file.size / 1024 / 1024).toFixed(2)} MB
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 space-x">
                            <span className="text-sm text-gray-600 font-medium">
                              نوع الوثيقة:
                            </span>
                            <Select
                              value={docObj.docType}
                              onValueChange={(value) =>
                                onUpdateDocumentType(index, value)
                              }
                            >
                              <SelectTrigger className="h-8 w-48 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {documentTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          type="button"
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-300"
                          onClick={() => onRemoveNewDocument(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfessionalDocumentUpload;
