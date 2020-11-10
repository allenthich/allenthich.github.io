---
layout: post
title: "Using git stash to share a patch containing untracked binary files"
categories: misc
---
## Using git stash to share a patch containing untracked binary files
Recently, I ran into a use case where I wanted to share code and new font files with another developer. Here are some of the details of the solution I found.

After creating a git stash with untracked font files, I created a git patch containing the diff of tracked files by redirecting the stashed content into a new file using the standard output command `>`.
{% highlight bash %}
# git stash show [<options>] [<stash>]
# [-p|--patch] Specifies creating a git patch
# [<stash>] Identifier among current stashes which can be shown via "git stash list"
$ git stash show -p --binary "stash@{0}" > myUpdate.patch
{% endhighlight %}

Now the untracked font files can be appended, using `>>`, to the existing patch file.

{% highlight bash %}
$ git diff --binary 4b825dc642cb6eb9a060e54bf8d69288fbee4904 stash^3 >> myUpdate.patch
{% endhighlight %}
> The easiest way to get the [contents of the untracked files] is to git diff against an empty tree. Git always has an empty tree in every repository whose ID is the magic number `4b825dc642cb6eb9a060e54bf8d69288fbee4904`. So a diff between that tree, and stash^3, will consist of a series of git patches that add the untracked files: [Refer reference 2]

The `--binary` option was required since the font files were binary file format. The error below will be thrown when applying the patch otherwise.

{% highlight bash %}
error: cannot apply binary patch to 'path/to/file' without full index line
error: 'path/to/file': patch does not apply"
{% endhighlight %}


The created patch can then be shared and applied:
{% highlight bash %}
$ git apply myUpdate.patch
{% endhighlight %}


---

### References
[1. Sharing a Git Stash With Another Developer](https://www.sep.com/sep-blog/2018/05/21/share-git-stash/)

[2. Git stash to patch with untracked files](https://stackoverflow.com/questions/22818155/git-stash-to-patch-with-untracked-files)

[3. How to do an export for git stash](https://stackoverflow.com/questions/47183452/how-to-do-an-export-for-git-stash)
