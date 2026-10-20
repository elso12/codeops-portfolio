import ReservationForm from "./ReservationForm";

export const metadata = {
  title: "Reserve a Handcrafted Mesob Table",
  description:
    "Book a traditional low-seated woven mesob or private banquet table for your family gathering, celebration, or afternoon Buna coffee ceremony.",
  alternates: {
    canonical: "/reservations",
  },
};

export default function ReservationsPage() {
  return (
    <div className="container">
      <div className="section-header-centered">
        <span className="section-eyebrow">የጠረጴዛ ቦታ ይያዙ · COMMUNAL HOSPITALITY</span>
        <h1 className="section-title-large">Reserve a Handcrafted Mesob</h1>
        <p className="section-sub-centered">
          Join us around the woven mesob for shared platters, rich wats, and ceremonial coffee. 
          Reservations guarantee authentic low-seating arrangements and tableside service.
        </p>
      </div>

      <ReservationForm />
    </div>
  );
}
