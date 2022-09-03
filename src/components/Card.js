function Card({ data }) {
  const { value, suit } = data;
  return <div className="card">{value}</div>;
}

export default Card;
