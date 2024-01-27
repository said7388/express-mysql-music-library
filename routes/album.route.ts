import express from 'express';
import { addNewAlbum, deleteAlbum, getAlbumById, getAlbumsByArtist, getAllAlbum, updateAlbum } from '../controllers/album.controller';

const router = express.Router();

router.get('/', getAllAlbum);
router.get('/:id', getAlbumById);
router.get('/artist/:id', getAlbumsByArtist);
router.post('/', addNewAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;