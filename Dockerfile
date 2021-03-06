FROM node:6.7.0
MAINTAINER MCDataPlus "particle4dev@gmail.com"

ENV DEBIAN_FRONTEND noninteractive

# Install yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
ENV PATH "$HOME/.yarn/bin:$PATH"

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
ADD package.json yarn.lock /tmp/
RUN $HOME/.yarn/bin/yarn cache clean
RUN cd /tmp && $HOME/.yarn/bin/yarn install --pure-lockfile

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/
RUN cp -a /tmp/node_modules /usr/src/app/

EXPOSE 4000

CMD ["npm", "start"]
