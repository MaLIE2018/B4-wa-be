"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var notFound = function (err, req, res, next) {
    if (err.status === 404) {
        res.status(404).send(err.message);
    }
    else {
        next(err);
    }
};
var badRequest = function (err, req, res, next) {
    if (err.status === 400) {
        res.status(400).send(err.message);
    }
    else {
        next(err);
    }
};
var notAuthorized = function (err, req, res, next) {
    if (err.status === 401) {
        res.status(401).send(err.message);
    }
    else {
        next(err);
    }
};
var forbidden = function (err, req, res, next) {
    if (err.status === 403) {
        res.status(403).send(err.message);
    }
    else {
        next(err);
    }
};
var catchAll = function (err, req, res, next) {
    if (err) {
        res.status(500).send("Generic Server Error");
    }
    next();
};
exports.default = [notFound, badRequest, notAuthorized, forbidden, catchAll];
