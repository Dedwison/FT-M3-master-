"use strict";
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
class $Promise {
  constructor(executor) {
    if (typeof executor !== "function")
      throw new TypeError("executor is not a function");

    this._state = "pending";
    this._handlerGroups = [];
    executor(this._internalResolve.bind(this), this._internalReject.bind(this));
  }
  _internalResolve(data) {
    if (this._state === "pending") {
      this._state = "fulfilled";
      this._value = data;
      this._callHandlers();
    }
  }
  _internalReject(reason) {
    if (this._state === "pending") {
      this._state = "rejected";
      this._value = reason;
      this._callHandlers();
    }
  }
  then(successCb, errorCb) {
    if (typeof successCb !== "function") successCb = false;
    if (typeof errorCb !== "function") errorCb = false;

    var downstreamPromise = new $Promise(() => {});

    this._handlerGroups.push({
      successCb,
      errorCb,
      downstreamPromise,
    });
    if (this._state !== "pending") {
      this._callHandlers();
    }
    return downstreamPromise;
  }
  _callHandlers() {
    while (this._handlerGroups.length) {
      var handler = this._handlerGroups.shift();
      if (this._state === "fulfilled") {
        // handler.successCb && handler.successCb(this._value);
        if (!handler.successCb) {
          handler.downstreamPromise._internalResolve(this._value);
        } else {
          try {
            const result = handler.successCb(this._value);
            //si arroja un error va al catch
            // y no lee nada mas de lo que haya
            //dentro del TRY...
            // result es una promesa???
            if (result instanceof $Promise) {
              result.then(
                (value) => {
                  handler.downstreamPromise._internalResolve(value);
                },
                (err) => {
                  handler.downstreamPromise._internalReject(err);
                }
              );
            } else {
              // es un valor
              handler.downstreamPromise._internalResolve(result);
            }
          } catch (error) {
            handler.downstreamPromise._internalReject(error);
          }
        }
      } else {
        // handler.errorCb && handler.errorCb(this._value);
        if (!handler.errorCb) {
          handler.downstreamPromise._internalReject(this._value);
        } else {
          try {
            const result = handler.errorCb(this._value);

            if (result instanceof $Promise) {
              result.then(
                (value) => {
                  handler.downstreamPromise._internalResolve(value);
                },
                (err) => {
                  handler.downstreamPromise._internalReject(err);
                }
              );
            } else {
              handler.downstreamPromise._internalResolve(result);
            }
          } catch (error) {
            handler.downstreamPromise._internalReject(error);
          }
        }
      }
    }
  }
  catch(errCB) {
    return this.then(null, errCB);
  }
  static resolve(value) {
    if (value instanceof $Promise) return value;
    const p = new $Promise(() => {});
    p._internalResolve(value);
    return p;
  }
  static all(promises) {
    if (!Array.isArray(promises)) throw new TypeError();
    let isPromises = false;
    for (let val of promises) {
      if (val instanceof $Promise) isPromises = true;
    }

    const p = new $Promise((resolve, reject) => {
      const totalPromises = promises.length;
      let resolvedPromises = 0;
      const results = new Array(totalPromises);
      promises.forEach((promise, index) => {
        if (promise instanceof $Promise) {
          promise.then((value) => {
            resolvedPromises++;
            results[index] = value;
            if (totalPromises === resolvedPromises) resolve(results);
          }, reject);
        } else {
          resolvedPromises++;
          results[index] = promise;
          if (totalPromises === resolvedPromises) resolve(results);
        }
      });
    });
    return p;
  }
}

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
