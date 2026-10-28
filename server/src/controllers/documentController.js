import mongoose from 'mongoose';
import Document from '../models/Document.js';
import HealthRecord from '../models/HealthRecord.js';
import { uploadBuffer, deleteFile } from '../services/uploadService.js';

export const getDocuments = async (req, res, next) => {
  try {
    const filter = { petId: req.pet._id };
    if (req.query.recordId) filter.recordId = req.query.recordId;
    const documents = await Document.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ data: documents });
  } catch (error) {
    next(error);
  }
};

export const createDocument = async (req, res, next) => {
  try {
    const { recordId, name } = req.body;

    if (recordId) {
      const valid =
        mongoose.isValidObjectId(recordId) &&
        (await HealthRecord.exists({ _id: recordId, petId: req.pet._id }));
      if (!valid) return res.status(404).json({ error: { message: 'Record not found' } });
    }

    const result = await uploadBuffer(req.file.buffer, 'documents');
    const document = await Document.create({
      owner: req.user.id,
      petId: req.pet._id,
      recordId: recordId || undefined,
      name: name || req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
    res.status(201).json({ data: document });
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const document = mongoose.isValidObjectId(req.params.id)
      ? await Document.findOne({ _id: req.params.id, petId: req.pet._id })
      : null;
    if (!document) return res.status(404).json({ error: { message: 'Document not found' } });

    await deleteFile(document.publicId, document.resourceType);
    await document.deleteOne();
    res.status(200).json({ data: { message: 'Document deleted' } });
  } catch (error) {
    next(error);
  }
};