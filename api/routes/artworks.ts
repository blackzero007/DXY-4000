import { Router } from 'express';
import { ArtworkController } from '../controllers/ArtworkController';
import { CommentController } from '../controllers/CommentController';

const router = Router();

router.get('/', ArtworkController.getArtworks);
router.get('/:id', ArtworkController.getArtworkById);
router.post('/', ArtworkController.createArtwork);
router.post('/:id/like', ArtworkController.toggleLike);
router.get('/:id/like-status', ArtworkController.checkLikeStatus);
router.post('/:id/view', ArtworkController.incrementViews);
router.get('/:id/comments', CommentController.getCommentsByArtworkId);
router.post('/:id/comments', CommentController.createComment);

export default router;
