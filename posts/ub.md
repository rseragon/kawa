---
title: Wait! what? UB? wdym?
date: 2022-12-04 10:00:03 +0530
categories: [C/C++, beginner]
tags: [UB, C, Cpp]
---

If you have ever programmed in C or C++, you would have heard the term "UB"; if not, 
then this article is for you, neophyte. UB stands for **U**ndefined **B**ehavior i.e., 
the behavior is not defined by standard [^standard] and can result in anything 
like a run-time error, segmentation fault, or "demons flying out of your nose. [^nasal-demons] "

### TL;DR
> [!NOTE]
> UB (Undefined Behavior) is the unpredictable behavior of the program
> generated by the compiler, which might vary from architecture to architecture
> and compiler to compiler. There are no rules that bind the program's output
> and can result in the program being terminated by a segmentation  fault or
> a flight to fall from a high altitude because the altitude variable
> overflowed. An example of this would be accessing an array out of its bounds
> or dereferencing a wild pointer.

## Contents


# What exactly is UB?
Ever wasted 3 hours of your life banging the head to the wall while debugging just to find out that a random
pointer went uninitialized causing the entire program to hard crash when it got dereferenced? 

> No?!?
{: .prompt-danger }

Then you might prefer to continue reading the article.
> Yes!?<br/> 
{: .prompt-warning }
Then there is a 100% chance that is because of a UB, and I urge to read this article.

For the starters, let's go with the basic definition. Here's a definition from [C FAQ](https://c-faq.com/):
> "Anything at all can happen; the Standard imposes no requirements. The program may 
> fail to compile, or it may execute incorrectly (either crashing or silently 
> generating incorrect results), or it may fortuitously do exactly what the 
> programmer intended."
{: .prompt-tip }

*So, a UB can cause anything... isn't that bad?*<br />
Yes! it is bad, and most of the times, it can be avoided by the 
programmer by being a bit cautious (excluding the atrocities caused by the 
compiler itself [^atrocities_of_compiler] ).

Let's take a look at few example for better understanding.

Consider this following code
```c
#include <stdio.h>

int main(void) {
  
  int *p; // A wild pointer has appeared!

  printf("%p\n", p); // Printing the address
  printf("%d\n", *p); // Dereferencing the pointer!

  return 0;
}
```
{: file="wild_ptr.c"}


Output with **gcc** (v11.1.0)
```console
❯ gcc wild_ptr.c -o gcc.out && ./gcc.out
(nil)
[1]    535911 segmentation fault (core dumped)  ./gcc.out
```

Output with **clang** (v13.0.0)
```console
❯ clang wild_ptr.c -o clang.out && ./clang.out
0x0efe3f0922f0
1
```

Output with **tcc** (v0.9.27)
```console
❯ tcc wild_ptr.c -o tcc.out && ./tcc.out
(nil)
[1]    537963 segmentation fault (core dumped)  ./tcc.out
```
([Wanna try out in more compilers?](https://godbolt.org/z/4fqnq5xY6){: target="_blank"})

![wildptr](https://cdn.jsdelivr.net/gh/rseragon/rseragon.github.io@master/assets/gif/ub/wild_ptr.gif)
Here, `P` is getting assigned to a random address because it is not allocated
or initialized with any memory, leading it to point to any block in the
address space. This situation might vary, as few "intelligent" compilers *might* predict
this and pre-initialized with `NULL`.[^preinit-null]

Considering the compiler outputs from above; the outputs from GCC and TCC are the same, leading to a Seg fault.
While clang, being an "somewhat-intelligent" compiler, makes sure that the program doesn't crash *atleast (phew)*.

*Then Clang gets it right by not crashing! So, clang is the best compiler, right?*<br />

If you are thinking like this, consider this example:

```c 
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
  
  // Allocating 10 blocks of char size data
  char* str = malloc(sizeof(char) * 10);

  // causes memory error as size of string
  // being copied is greater than 10
  strcpy(str, "Some String which will overflow");

  printf("%s\n", str);

  return 0;
}

```
{: file="buffer_overflow.c"}

Output with **gcc** (v11.1.0)
```console
❯ gcc buffer_oveflow.c -o gcc.out
buffer_oveflow.c: In function ‘main’:
buffer_oveflow.c:9:3: warning: ‘__builtin_memcpy’ writing 32 bytes into a region of size 10 overflows the destination [-Wstringop-overflow=]
    9 |   strcpy(str, "Some String which will overflow");
      |   ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
buffer_oveflow.c:7:15: note: destination object of size 10 allocated by ‘malloc’
    7 |   char* str = malloc(sizeof(char) * 10);
      |               ^~~~~~~~~~~~~~~~~~~~~~~~~

❯ ./gcc.out
malloc(): corrupted top size
[1]    589156 abort (core dumped)  ./overflow.out
```

Output with **clang** (v13.0.0)
```console
❯ clang buffer_overflow.c -o clang.out

❯ ./clang.out
malloc(): corrupted top size
[1]    590478 abort (core dumped)  ./clang.out

```
In this case, Clang did not produce any error at all[^gomen-nasai]. But,
GCC warned the user about the String operation overflow; *So, is GCC the best compiler?*<br />
If you are asking about the best compiler... we could have a debate
until the end of the eternity. Leaving aside the issue of determining which compiler is the best,
if we look at the output of both of the binaries 
generated by the compilers, we can notice that they are pretty much the same.

But this might vary from your computer to my computer, or from GCC or MSVC or Clang.
This is the reason it is called a UB, since we are unable to predict what might 
happen; it's a programmers nightmare!

## So, how do we fix it now? 
Most of these errors can be easily fixed by the
programmer being cautious about what he is trying to achieve and how the
compiler perceives it. It may be a time-consuming task, but it is better to not
have any UB lurking inside your code, waiting for a perfect Saturday to
manifest itself and ruin your weekend!


For example consider the above code where we derefernced a wild pointer, 
fixing it is as easy as a stroll in the park. (unless you are an introvert)

- An easy solution would be to always intialize a poitner with `NULL`
```c
...
  int *p = NULL;
...
```
![NULL ptr](https://cdn.jsdelivr.net/gh/rseragon/rseragon.github.io@master/assets/gif/ub/null_ptr.gif)


*So, I've fixed the UB, now can I access the pointer `p`?* <br />
Do you expect to time travel[^time_travel] if you jump into the black hole? No! you'll be shredded into
bits before you even reach the event horizon.<br />
Remember **DO NOT** dereference a `NULL` pointer, it's definitely a UB and most of time will lead to a Segmentation fault.


*B-but, you just said that you need to always initialize poitners with `NULL`?*<br />
Yes! but don't dereference it yet, assign or allocate it some memory and then 
dereference it. Like: 

```c
...
p = (int *) malloc(sizeof(int) * 177013);
...
```
![good ptr](https://cdn.jsdelivr.net/gh/rseragon/rseragon.github.io@master/assets/gif/ub/good_ptr.gif)

## Aren't there any general solutions for this?
 Unfortunately, there isn't any general solution for all of these UBs. The programmer has to
identify them manually and come up with a solution.<br />
But there are some practices which you can follow:
  - Enable compiler diagnostic messages (`-W<flag>`)
  - Use compiler built-in Sanitizers (eg: `-fsanitize-address`)
  - Use static analyzers to get more warnings
  - Check for memory leaks using valgrind
  - Use a good debugger (like gdb, lldb, ...)
  - And many more!


## Why do they exist?
Now that you know a bit of what UB is[^ReadMore], I would like to give you my opinion why
this obscure construct still exsists and why can't the standard committee abolish and bring
peace and glory! (Note: This opinion is **very** biased, but here you go.)
- _Speed_ <br />
  Checking for UB either at runtime or at compile time might just add an extra overload to the program, 
  which would affect its precious runtime speed. Because many low-level drivers and kernels are written in C, 
  it may break a few APIs or functions and bring the entire hell down on the maintainer's head.
- _Size_ <br />
  Adding in these run-time checks might just bloat the program with unwanted clutter and lead to a larger executable size.	
- _Quality_ <br />
  Ever thought of using UB as a feature? Yeah! You read it right. There are a few
  (a very few), programs out there that take advantage of UB to apply ethereal rocket 
  science mechanics to their work. And tampering with these historical relics may call the Cthulhu!
- _History_ <br />
  Many of the low-level programs are old and are meant to be reliable; putting the 
  programs built with it aside, the language itself is pretty old, and bringing a 
  heavy paradigm shift that might affect the entire structural design of the system is something that cannot be done. :(
- _Laziness_ <br />
  It's self explanatory. 
  There was a time when an extra stray double quote(`"`) was declared as a UB by the standard 



---
# References and further reading
- [What Every C Programmer Should Know About Undefined Behavior #1/3](https://blog.llvm.org/2011/05/what-every-c-programmer-should-know.html)
- [A Guide to Undefined Behavior in C and C++, Part 1](https://blog.regehr.org/archives/213)
- [Undefined Behavior Consequences Contest Winners(John Regehr)](https://blog.regehr.org/archives/767)
- [c-faq](http://c-faq.com)

[^nasal-demons]: [Nasal Demons](http://catb.org/jargon/html/N/nasal-demons.html)
[^standard]: The ISO [C](https://www.open-std.org/jtc1/sc22/wg14/) and [C++](https://isocpp.org/std/the-standard) standard
[^atrocities_of_compiler]: This might be a case of non-conformant or older version of compiler; Bugs should be exepected when using these age old abominations.
[^gomen-nasai]: This is a case where I've not used any compiler arguments. It could have been a different case if ASan or any other compiler args would have been used.
[^ReadMore]: This article just barely scratches the surface of few abominations a UB can do. If you wanna read more about it look at the [References](#references-and-further-reading) or just google :D
[^preinit-null]: This is a rare scenario and is quite considered to be an overhead, refer [this](https://stackoverflow.com/a/1910875) for more info.
[^time_travel]: Another connotation bought up by `darkblueflow💠#5176` from discord (Thank you!). Refer [here](https://devblogs.microsoft.com/oldnewthing/20140627-00/?p=633)