/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const { resValidator } = require("../../../front-end/src/utils/validationtest");

async function list(req, res) {
  const response = await service.list(req.query.date);
  return res.json({
    data: [...response],
  });
}

async function validate(req, res, next) {
  const newRes = req.body.data;
  let message;
  function setError(err) {
    if (err) message = err.message;
  }
  if (!newRes) {
    return next({
      status: 400,
      message:
        "Invalid input given. Requires {string : [first_name, last_name, mobile_number], date:reservation_date, time:reservation_time, number:people}",
    });
  }

  if (!resValidator(newRes, setError) || typeof newRes.people != "number") {
    if (!message) {
      message = "people must be a number";
    }
    return next({ status: 400, message });
  } else {
    return next();
  }
}

async function create(req, res, next) {
  const newRes = await service.create(req.body.data);
  res.status(201).json({ data: newRes });
}

async function read(req, res, next) {
  const reservation = await service.read(req.params.reservationId);
  console.log(req.params)
  res.json({ data : reservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(validate), asyncErrorBoundary(create)],
  read
};
