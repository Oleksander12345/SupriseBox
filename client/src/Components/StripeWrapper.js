import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Checkout from "../pages/Checkout";

const stripePromise = loadStripe("pk_test_51RPQAUQxS8XCCvem6tudWXy1BfRFYEBDWWGgYq5wWgdvebHs7dAG9nfVRdDL569Ki1ihwE9zJEcHFwWN0DeMWacR00Zksguxm4");
console.log("🔑 Stripe public key:", stripePromise);
export default function StripeWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <Checkout/>
    </Elements>
  );
}
