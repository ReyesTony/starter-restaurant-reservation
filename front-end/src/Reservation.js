//Child component to display all the indivdual reservations on the various pages its needed on.

import React from "react";
import CancelButton from "./CancelButton";

export default function Reservation({ reservation, setReservations, date }) {
  return (
    <div className="card">
      <div className="card-body">
        <h4 className="card-title">
          Reservation for {`${reservation.first_name} ${reservation.last_name}`}
        </h4>
        <p className="card-text">Phone Number: {reservation.mobile_number}</p>
        <p className="card-text">Time: {reservation.reservation_time}</p>
        <p className="card-text">Party Size: {reservation.people}</p>
        <p
          className="card-text"
          data-reservation-id-status={reservation.reservation_id}
        >
          {reservation.status.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
            return g1.toUpperCase() + g2.toLowerCase();
          })}
        </p>
        {reservation.status === "booked" ? (
          <a
            href={`/reservations/${reservation.reservation_id}/seat`}
            className="btn btn-info mr-1"
          >
            Seat
          </a>
        ) : null}
        <a
          href={`/reservations/${reservation.reservation_id}/edit`}
          className="btn btn-info mr-1"
        >
          {" "}
          Edit
        </a>
        <CancelButton
          reservation={reservation}
          setReservations={setReservations}
          date={date}
        />
      </div>
    </div>
  );
}
