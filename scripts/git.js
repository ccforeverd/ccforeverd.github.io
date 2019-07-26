const fs = require('fs-extra')
const path = require('path')
const Git = require('nodegit')
const del = require('del')

const TEMP_PATH = path.resolve(__dirname, '../.tmp')
const TARGET_PATH = path.resolve(__dirname, '../dist')

async function main () {
  await del(TEMP_PATH)
  await Git.Clone('https://github.com/ccforeverd/el-button-copy', TEMP_PATH)
  await fs.copy(TARGET_PATH, TEMP_PATH)

  const repo = await Git.Repository.open(path.resolve(TEMP_PATH, '.git'))
  const index = await repo.refreshIndex()
  const status = await repo.getStatus()
  const paths = status.map(file => file.path())

  await Promise.all(paths.map(async item => {
    await index.addByPath(item)
  }))
  await index.write()

  const oid = await index.writeTree()
  const head = await Git.Reference.nameToId(repo, 'HEAD')
  const parent = await repo.getCommit(head)
  const signature = Git.Signature.now('ccforeverd', 'zh1045456074@163.com')

  await repo.createCommit('HEAD', signature, signature, 'push push', oid, [parent])

  // console.log(await Git.Remote.list(repo))

  // const remote = await Git.Remote.lookup(repo, 'origin')
  // 'git@github.com:ccforeverd/el-button-copy.git'

  // console.log('delete', await Git.Remote.delete(repo, 'origin'))
  // const remote = await Git.Remote.createAnonymous(repo, 'git@github.com:ccforeverd/el-button-copy.git')

  Git.Remote.setPushurl(repo, 'origin', 'git@github.com:ccforeverd/el-button-copy.git')

  const remote = await repo.getRemote('origin')
  const cred = Git.Cred.sshKeyNew(
    'zh1045456074@163.com',
    path.join(process.env.HOME, '.ssh', 'id_rsa.pub'),
    path.join(process.env.HOME, '.ssh', 'id_rsa'),
    ''
  )
  console.log(cred)
  const callbacks = {
    credentials: function(url, userName) {
      console.log(url, userName)
      // git@github.com:ccforeverd/el-button-copy.git git
      // git@github.com:ccforeverd/el-button-copy.git git
      // git@github.com:ccforeverd/el-button-copy.git git
      // git@github.com:ccforeverd/el-button-copy.git git
      // git@github.com:ccforeverd/el-button-copy.git git
      // git@github.com:ccforeverd/el-button-copy.git git
      // git@github.com:ccforeverd/el-button-copy.git git
      // git@github.com:ccforeverd/el-button-copy.git git
      // git@github.com:ccforeverd/el-button-copy.git git
      // git@github.com:ccforeverd/el-button-copy.git git
      // git@github.com:ccforeverd/el-button-copy.git git
      // git@github.com:ccforeverd/el-button-copy.git git
      // ... 一直显示这个 原因未知
      // return Git.Cred.sshKeyFromAgent(userName)
      return cred
    },
    // certificateCheck: () => 1
  }
  // await remote.connect(Git.Enums.DIRECTION.PUSH, callbacks)
  // return
  await remote.push(
    ['refs/heads/master:refs/heads/master'],
    {
      callbacks
    },
    repo.defaultSignature(),
    'push push'
  )


  // console.log(remote.pushurl())
  // console.log(remote.url())
  // console.log(Git.Cred.sshKeyFromAgent('git').hasUsername())
  // console.log(Git.Cred.sshKeyFromAgent('ccforeverd').hasUsername())
  // console.log(Git.Cred.sshKeyFromAgent('zh1045456074@163.com').hasUsername())

  // console.log(Git.Remote.addPush(repo, 'origin', 'refs/heads/master:refs/heads/master'))

  

  console.log('Done~!')

  // console.log(repo.)
  // status.forEach(file => {
  //   if (file.isNew()) console.log(file.path(), "NEW")
  //   if (file.isModified()) console.log(file.path(), "MODIFIED")
  //   if (file.isTypechange()) console.log(file.path(), "TYPECHANGE")
  //   if (file.isRenamed()) console.log(file.path(), "RENAMED")
  //   if (file.isIgnored()) console.log(file.path(), "IGNORED")
  // })
  

  // await repo.createCommitOnHead()

  // setTimeout(() => del(TEMP_PATH), 1000)
}

main()

/*
----

参考:

- <https://github.com/jprichardson/node-fs-extra> await fs.copy(from, to)
- <https://github.com/sindresorhus/del> await del(path)

----
*/
