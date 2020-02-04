const faker = require("faker");
const fs = require("fs");
const exec = require("child_process").exec;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let files = fs.readdirSync("./");
if (files.length > 49) {
  files.forEach(filename => {
    if (filename.startsWith("NOT_")) fs.unlinkSync(filename);
  });
}

class AsyncCommit {
  constructor() {
    faker.seed(Date.now());
    this.count = 0;
    this.times = randomInt(3, 33);
    console.log(`计划提交${this.times}次`);
  }

  content() {
    return faker.lorem.sentence();
  }

  file() {
    return "NOT_" + faker.random.uuid() + "___" + faker.random.number();
  }

  message() {
    return faker.random.words(randomInt(1, 9));
  }

  waitTime() {
    return randomInt(1, 1000);
  }

  pushToHub() {
    console.log(`第${++this.count}次提交`);
    exec(`git add ./`, (err, stdout, stderr) => {
      err && console.log(stderr);
      !err && console.log(stdout);
      let cmd = `git commit -am "${faker.random.words()}"`;
      exec(cmd, (err, stdout, stderr) => {
        if (!err) {
          console.log(stdout);
          exec(`git push`, (err, stdout, stderr) => {
            console.log(stdout);
            err && console.log(stderr);
            setTimeout(() => {
              this.commit();
            }, this.waitTime());
          });
        } else {
          console.log(stderr);
        }
      });
    });
  }

  commit() {
    --this.times;
    if (this.times >= 0) {
      fs.writeFile(this.file(), this.content(), err => {
        err && console.log(err);
        !err && this.pushToHub();
      });
    } else {
      console.log("完成");
    }
  }
}

new AsyncCommit().commit();
