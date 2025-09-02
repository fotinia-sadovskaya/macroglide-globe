import { Exchange } from "../data/Types/Exchange";

type Props = {
  exchange: Exchange;
};

export default function ExchangeObj({ exchange }: Props) {
  return (
    <div>
      <h3>{exchange.name}</h3>
      <p>Last: {exchange.last}</p>
      <p>Buy: {exchange.buy}</p>
      <p>Sell: {exchange.sell}</p>
    </div>
  );
}
