function TypingIndicator({ user }: { user: string }) {
    return (
        <div className="ticontainer">
            <div className="tiblock">
                <div className="tidot"></div>
                <div className="tidot"></div>
                <div className="tidot"></div>
            </div>
        </div>
    );
}

export default TypingIndicator;
