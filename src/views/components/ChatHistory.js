// ChatHistory.js
export default {
    name: 'ChatHistory',
    data() {
        return {
            chats: [],
            selectedChat: null,
            messages: [],
            loadingChats: false,
            loadingMessages: false,
        }
    },
    methods: {
        async openModal() {
            this.selectedChat = null;
            this.messages = [];
            await this.fetchChats();
            $('#modalChatHistory').modal('show');
        },
        async fetchChats() {
            this.loadingChats = true;
            try {
                const response = await window.http.get('/chats');
                this.chats = response.data.results.data || response.data.results || [];
            } catch (err) {
                showErrorInfo(err);
            } finally {
                this.loadingChats = false;
            }
        },
        async selectChat(chat) {
            this.selectedChat = chat;
            await this.fetchMessages(chat.JID || chat.jid);
        },
        async fetchMessages(chatJid) {
            this.loadingMessages = true;
            try {
                const response = await window.http.get(`/chat/${chatJid}/messages`);
                this.messages = response.data.results.data || response.data.results || [];
            } catch (err) {
                showErrorInfo(err);
            } finally {
                this.loadingMessages = false;
            }
        },
        formatDate(value) {
            if (!value) return '';
            return moment(value).format('LLL');
        }
    },
    template: `
    <div class="orange card" @click="openModal" style="cursor: pointer">
        <div class="content">
            <a class="ui orange right ribbon label">Chat</a>
            <div class="header">Chat History</div>
            <div class="description">
                View chat history and messages
            </div>
        </div>
    </div>
    <!-- Modal ChatHistory -->
    <div class="ui large modal" id="modalChatHistory">
        <i class="close icon"></i>
        <div class="header">
            Chat History
        </div>
        <div class="content">
            <div v-if="loadingChats" class="ui active centered inline loader"></div>
            <div v-else-if="!selectedChat">
                <table class="ui celled table">
                    <thead>
                        <tr>
                            <th>Chat JID</th>
                            <th>Name</th>
                            <th>Last Message</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="chat in chats" :key="chat.JID || chat.jid">
                            <td>{{ chat.JID || chat.jid }}</td>
                            <td>{{ (chat.Name || chat.name) ? (chat.Name || chat.name) : (chat.JID || chat.jid) }}</td>
                            <td>{{ formatDate(chat.LastMessageTime || chat.last_message_time) }}</td>
                            <td>
                                <button class="ui blue tiny button" @click="selectChat(chat)">View Messages</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <button class="ui left labeled icon button" @click="selectedChat = null">
                    <i class="left arrow icon"></i>
                    Back to Chats
                </button>
                <h4 class="ui dividing header">
                    Messages for {{ (selectedChat.Name || selectedChat.name) ? (selectedChat.Name || selectedChat.name) : (selectedChat.JID || selectedChat.jid) }} ({{ selectedChat.JID || selectedChat.jid }})
                </h4>
                <div v-if="loadingMessages" class="ui active centered inline loader"></div>
                <table v-else class="ui celled table">
                    <thead>
                        <tr>
                            <th>Sender</th>
                            <th>Content</th>
                            <th>Timestamp</th>
                            <th>Media Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="msg in messages" :key="msg.ID || msg.id">
                            <td>{{ msg.SenderJID || msg.sender_jid }}</td>
                            <td>{{ msg.Content || msg.content }}</td>
                            <td>{{ formatDate(msg.Timestamp || msg.timestamp) }}</td>
                            <td>{{ msg.MediaType || msg.media_type }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `
}