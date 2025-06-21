/**
 * A 'conversation' between the user and the system.
 * <p>
 * Typically, an important topic that requires a user's full attention.
 * Focus is placed on the conversation, usually as a pop-up,
 * and the background is usually darkened to draw attention to the conversation.
 * @see DialogComponent
 */
export interface Dialog {

  showDialog(): void;

  hideDialog(): void;

}
