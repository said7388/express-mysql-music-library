import express from 'express';
import { addNewSong, deleteSong, getAllSong, getSongById, getSongsForAlbum, updateSong } from '../controllers/song.controller';

const router = express.Router();

router.get('/', getAllSong);
router.get('/:id', getSongById);
router.get('/album/:id', getSongsForAlbum);
router.post('/', addNewSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

export default router;