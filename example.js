var JsonapiClient = require("./lib/Client");

const clientExample = async () => {
  try {
    const client = new JsonapiClient("http://localhost:16006/rest", {
      header: {
        authToken: "2ad1d6f7-e1d0-480d-86b2-dfad8af4a5b3"
      }
    });

    const article = client.create("articles");
    article.set("title", "foobar");
    article.set("content", "Hello world!")
    const response = await article.sync()
    console.log(`Resource created. Response ${JSON.stringify(response)}`);

    const resources = await client.find("articles", {page:{offset:0,limit:4}})
    resources.map(function(resource, index) {
      console.log(`Article # ${index}`);
      console.log(resource.toJSON());
    });

    console.log('first article')
    console.log(resources[0].toJSON());

    const articleZero = await client.get("articles", resources[0]._getBase().id, { include: [ "author" ] })
    console.log('got first article');
    console.log(articleZero.toJSONTree());

    const articleOne = await client.get("articles", resources[1]._getBase().id)
    console.log('got second article');
    console.log(articleOne.toJSONTree());


    const author = await articleOne.fetch("author")
    console.log('result article')
    console.log(author.toJSON());
    console.log(articleOne.toJSONTree());
    console.log(articleOne.get("author"));
    
    let comment = client.create("comments");
    comment.set("body", "Nice!");
    await comment.sync()
    console.log('synced comment')
    console.log(comment.toJSON());

    article.relationships("comments").add(comment);
    await article.sync()
    console.log("Resource's relation updated");

    await article.delete()
    console.log("Resource deleted");

  } catch (err) {
    console.log(err)
  }
}

clientExample()
