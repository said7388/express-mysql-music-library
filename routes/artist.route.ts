import express from 'express';
import { addNewArtist, deleteArtist, getAllArtist, getArtistById, getArtistsInAlbum, updateArtist } from '../controllers/artist.controller';

const router = express.Router();

router.get('/', getAllArtist);
router.get('/:id', getArtistById);
router.get('/album/:id', getArtistsInAlbum);
router.post('/', addNewArtist);
router.put('/:id', updateArtist);
router.delete('/:id', deleteArtist);

export default router;