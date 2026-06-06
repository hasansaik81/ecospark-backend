import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { VoteController } from './vote.controller';
import { voteValidationSchema } from './vote.validation';

const router = express.Router();

router.post(
    '/:id/vote',
    auth('member'),
    validateRequest(voteValidationSchema.castVote),
    VoteController.castVote,
);

router.delete('/:id/vote', auth('member'), VoteController.removeVote);

export const VoteRoutes = router;
