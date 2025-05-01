import PropTypes from "prop-types";

const ChatBox = ({ messages }) => {
    return (
        <div>
            {messages.map((msg, index) => (
                <p key={msg._id || index}>
                    <strong>{msg.senderId}:</strong> {msg.message}
                </p>
            ))}
        </div>
    );
};

ChatBox.propTypes = {
    messages: PropTypes.array.isRequired
};

export default ChatBox;
