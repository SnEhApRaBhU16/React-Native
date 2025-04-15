export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp?: string;
  imageUrl?: string;
  isUploading?: boolean;
}
export interface RouteParams {
  selectedUser: {
    uid: string;
    name: string;
  };
  chatId: string;
}
