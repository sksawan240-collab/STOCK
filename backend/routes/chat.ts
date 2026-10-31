import { Router } from 'express';
import { verifyAuth, AuthRequest } from '../middleware/auth.js';
import { Chat } from '../models/Chat.js';
import { Analysis } from '../models/Analysis.js';
import { askStockChatbot } from '../services/aiService.js';

const router = Router();

// Get all chat conversations for user
router.get('/conversations', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const chats = await Chat.find({ userId: req.user?.userId }).sort({ updatedAt: -1 }).limit(20);
    res.json({ success: true, conversations: chats });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Create new conversation
router.post('/conversations', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const { title, associatedAnalysisId } = req.body;
    const chat = await Chat.create({
      userId: req.user?.userId,
      title: title || 'New Stock Conversation',
      associatedAnalysisId: associatedAnalysisId || undefined,
      messages: []
    });
    res.status(201).json({ success: true, conversation: chat });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single conversation
router.get('/conversations/:id', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user?.userId });
    if (!chat) return res.status(404).json({ error: 'Conversation not found.' });
    res.json({ success: true, conversation: chat });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Send message in conversation & get AI response
router.post('/conversations/:id/messages', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Message content is required.' });

    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user?.userId });
    if (!chat) return res.status(404).json({ error: 'Conversation not found.' });

    // Append user message
    chat.messages.push({ role: 'user', content, timestamp: new Date() });

    // Fetch analysis context if associated
    let analysisContext = null;
    if (chat.associatedAnalysisId) {
      analysisContext = await Analysis.findById(chat.associatedAnalysisId);
    }

    // Call AI chatbot service
    const historyForAI = chat.messages.map((m: any) => ({ role: m.role, content: m.content }));
    const aiReply = await askStockChatbot(historyForAI, analysisContext);

    // Append AI response
    chat.messages.push({ role: 'assistant', content: aiReply, timestamp: new Date() });
    chat.updatedAt = new Date();
    await chat.save();

    res.json({ success: true, conversation: chat, reply: aiReply });
  } catch (err: any) {
    console.error('Chat AI error:', err);
    res.status(500).json({ error: err.message || 'Failed to get AI response.' });
  }
});

// Delete conversation
router.delete('/conversations/:id', verifyAuth, async (req: AuthRequest, res) => {
  try {
    const deleted = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user?.userId });
    if (!deleted) return res.status(404).json({ error: 'Conversation not found.' });
    res.json({ success: true, message: 'Conversation deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
