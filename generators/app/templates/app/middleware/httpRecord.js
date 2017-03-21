'use strict';

function body(obj) {
   return (JSON.stringify(obj) || '').substr(0, 300)
}

// just for showcase, egg had a build-in middleware to export `x-readtime` header
module.exports = options => {
  return function* (next) {
    // debugger;

      this.app.logger.info(`[HTTP_RECORD]URL:${this.request.url} REQUEST BODY:${body(this.request.body)}`)
    yield next;
      // debugger;
      this.app.logger.info(`[HTTP_RECORD]URL:${this.request.url} RESPONSE BODY:${body(this.response.body)}`)
  };
};


