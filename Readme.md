# Make sure to follow this guide to properly configure your project:

## Setup

### Installing

If this is the first VtexIO project that you will work on, make sure you have the toolbel installed on you machine `https://github.com/vtex/toolbelt`

```
yarn global add vtex
```
And rode the 
``` 
yarn global bin
```

And copy the path `https://prnt.sc/11b9207`

We have a slite documentation too about the started `https://avanti.slite.com/app/channels/XAj2bTX6eF/notes/RYKLJ7G2xQ`

### Configuration

 1. On the terminal of your choice enter on `store-theme`;
 2. Login in the store `vtex login namestoreio`;
 3. `vtex workspace list` to see all the workspaces on the project;
 4. Then create your workspace `vtex use NOMEWORKSPACE`;
 5. For last `vtex link` to run the project;

### When started IO

When started IO some errors appers, install this dependencies

```
vtex install vtex.reviews-and-ratings@2.x
vtex install vtex.admin-search@1.x 
vtex install vtex.search-resolver@1.x 
```

## To make a deploy 
#### Both app and store - The first line is if you are on the branch, to deploy it needs to be done on the master
```
git push --set-upstream origin minha-branch
vtex release patch stable
vtex publish 
vtex deploy --force
vtex install
```

## To make a minor deploy replace patch for minor

```
vtex release minor stable
```

### Tips

To see the classes and the **css** file where the component is use `?__inspect` in the url of the site

```
https://meuworkspace--nomedaloja.myvtex.com?__inspect
```

### Documentation
You can access the documents of IO in `https://github.com/vtex-apps/store-theme`, `https://learn.vtex.com/page/learning-path-lang-pt` and `https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-using-css-handles-for-store-customization`



