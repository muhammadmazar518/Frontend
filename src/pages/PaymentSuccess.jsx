import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import { Spinner, Button } from "../components/ui";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const session_id = searchParams.get("session_id");

    if (!session_id) {
      window.location.href = "/pricing";
      return;
    }

    api
      .post("/payment/verify", { session_id })
      .then((res) => {
        if (res.data.success) {
          setStatus("success");

          setTimeout(() => {
            window.location.href = "/courses";
          }, 3000);
        } else {
          setStatus("failed");
        }
      })
      .catch(() => {
        setStatus("failed");
      });
  }, [searchParams]);

  return (
    <div className="payment-success">
      {status === "verifying" && (
        <>
          <Spinner />
          <h2>Verifying your payment...</h2>
        </>
      )}

      {status === "success" && (
        <>
          <div>🎉</div>
          <h2>Payment Successful!</h2>
          <p>
            You are now a Pro member. All courses are unlocked!
          </p>
          <p>Redirecting to courses in 3 seconds...</p>

          <Button
            size="lg"
            onClick={() => {
              window.location.href = "/courses";
            }}
          >
            Go to Courses →
          </Button>
        </>
      )}

      {status === "failed" && (
        <>
          <div>❌</div>
          <h2>Payment Failed</h2>
          <p>Something went wrong. Please try again.</p>

          <Button
            size="lg"
            onClick={() => {
              window.location.href = "/pricing";
            }}
          >
            Back to Pricing
          </Button>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
