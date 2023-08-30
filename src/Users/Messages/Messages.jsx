import React, { useState, useEffect } from "react";
import "./Messages.scss";

// Composant pour un message individuel
const Message = ({ message }) => {
  return (
    <div className="message">
      <div className="message-header">
        <span className="message-username">{message.username}</span>
        <span className="message-time">{message.time}</span>
      </div>
      <div className="message-content">{message.content}</div>
    </div>
  );
};

const Sidebar = ({
  conversations,
  currentConversation,
  setCurrentConversation,
  clearMessageAndError,
  openCreateConversationPopup
}) => {
  const handleClick = (conversation) => {
    setCurrentConversation(conversation);
    clearMessageAndError();
  };

  return (
    <div className="sidebar">
      <h2>Mes messages</h2>
      <ul>
        {conversations.map((conversation, index) => (
          <li
            key={index}
            className={conversation === currentConversation ? "active" : ""}
            onClick={() => handleClick(conversation)}
          >
            {conversation.name}
          </li>
        ))}
      </ul>
      <button onClick={openCreateConversationPopup}>
        Nouvelle conversation
      </button>
    </div>
  );
};

const CreateConversationPopup = ({
  contacts,
  createConversation,
  closeCreateConversationPopup
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleContactSelection = (contactId) => {
    setSelectedContacts((prevSelectedContacts) => {
      if (prevSelectedContacts.includes(contactId)) {
        return prevSelectedContacts.filter((id) => id !== contactId);
      } else {
        return [...prevSelectedContacts, contactId];
      }
    });
  };

  const handleCreateConversation = () => {
    const newConversationName = searchInput.trim();
    if (newConversationName === "") {
      return;
    }

    createConversation(newConversationName);
    closeCreateConversationPopup();
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Nouvelle conversation</h2>
        <input
          type="text"
          placeholder="Rechercher un contact"
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className={selectedContacts.includes(contact.id) ? "selected" : ""}
              onClick={() => handleContactSelection(contact.id)}
            >
              {contact.name}
            </li>
          ))}
        </ul>
        <button onClick={handleCreateConversation}>Créer la conversation</button>
        <button onClick={closeCreateConversationPopup}>Annuler</button>
      </div>
    </div>
  );
};

const Messages = () => {
  const [conversations, setConversations] = useState([
    { id: 1, name: "Adrien" },
    { id: 2, name: "Nathan" }
  ]);
  const [currentConversation, setCurrentConversation] = useState(
    conversations[conversations.length - 1]
  );
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [showCreateConversationPopup, setShowCreateConversationPopup] = useState(
    false
  );
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Effectuer une requête GET pour récupérer les messages de la conversation actuelle
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/messages?conversationId=${currentConversation.id}`
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages :", error);
      }
    };

    fetchMessages();
  }, [currentConversation]);

  useEffect(() => {
    // Effectuer une requête GET pour récupérer la liste des contacts
    const fetchContacts = async () => {
      try {
        const response = await fetch("/api/contacts");
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des contacts :", error);
      }
    };

    fetchContacts();
  }, []);

  const sendMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
    const username = "User";
    const content = newMessage;

    const messageData = { username, time, content };

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message.");
      }

      const data = await response.json();
      const updatedMessages = [...messages, data];
      setMessages(updatedMessages);
      setNewMessage("");
      setError("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      setError("Erreur lors de l'envoi du message. Veuillez réessayer.");

      // Ajouter le message avec indication d'erreur dans la liste des messages locaux
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
      const message = {
        username: "User",
        time,
        content: newMessage,
        error: true
      };
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const clearMessageAndError = () => {
    setMessages([]);
    setError("");
  };

  const openCreateConversationPopup = () => {
    setShowCreateConversationPopup(true);
  };

  const closeCreateConversationPopup = () => {
    setShowCreateConversationPopup(false);
  };

  const createConversation = (conversationName) => {
    const newConversation = {
      id: conversations.length + 1,
      name: conversationName
    };
    setConversations([...conversations, newConversation]);
  };

  return (
    <div className="messaging-page">
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
        clearMessageAndError={clearMessageAndError}
        openCreateConversationPopup={openCreateConversationPopup}
      />
      <div className="chat">
        {currentConversation ? (
          <div>
            <h2>Conversation : {currentConversation.name}</h2>
            <div className="message-list">
              {messages.map((message, index) => (
                <Message key={index} message={message} />
              ))}
              {error && <div className="error-message">{error}</div>}
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Composez votre message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button onClick={sendMessage}>Envoyer</button>
            </div>
          </div>
        ) : (
          <div>Aucune conversation sélectionnée.</div>
        )}
      </div>
      {showCreateConversationPopup && (
        <CreateConversationPopup
          contacts={contacts}
          createConversation={createConversation}
          closeCreateConversationPopup={closeCreateConversationPopup}
        />
      )}
    </div>
  );
};

export default Messages;
