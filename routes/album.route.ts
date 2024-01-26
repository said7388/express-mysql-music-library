import express from 'express';
import { addNewAlbum, deleteAlbum, getAlbumById, getAllAlbum, updateAlbum } from '../controllers/album.controller';

const router = express.Router();

router.get('/', getAllAlbum);
router.get('/:id', getAlbumById);
router.post('/', addNewAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;