import "../styles/CartItem.css";

interface CartItemProps {
  title: string;
  price: number;
  detail: string;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItem = ({
  title,
  price,
  detail,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) => {
  return (
    <div className="cart-item card">
      <div>
        <h4>{title}</h4>
        <p className="muted">{detail}</p>
      </div>
      <div className="cart-item__controls">
        <div className="cart-item__qty">
          <button type="button" onClick={onDecrease} aria-label="Decrease quantity">
            -
          </button>
          <span>{quantity}</span>
          <button type="button" onClick={onIncrease} aria-label="Increase quantity">
            +
          </button>
        </div>
        <strong>₹{price * quantity}</strong>
        <button className="cart-item__remove" type="button" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
