import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },   // job related to notification
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }, // read/unread status
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
