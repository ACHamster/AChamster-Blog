---
title: 'React Fiber 学习笔记'
date: '2024-03-18'
tags: ['web', 'React']
excerpt: '我对fiber的简单理解'
cover: '/covers/cover2.png'
---

### 为什么需要Fiber架构
我认为Fiber的出现旨在实现对React的调度实现更精细的控制，优化用户的使用体验。
React从本质上来说是一个构建页面的架构，假如花费太多的时间在数据的计算上，则会影响页面UI的渲染，造成卡顿。在React16之前
，更新时采用的Diff算法会递归遍历整个虚拟DOM，这个过程很耗费时间，并且是不可中断的，因为当时不可能定位到上次中断的位置，再继续进行遍历。

### 前置概念
在弄清楚什么是Fiber之前，我们需要了解几个基本概念。  
*Reconciliation*  
Reconciliation（协调器）的核心功能是通过算法去diff两颗不同的树，确认哪些部分是需要修改的。
在更新的时候，重新渲染整个页面的消耗是巨大的，为了优化应用的重新渲染，React优化了很多部分来确保最好性能表现，在这之中最主要的部分的就来自Reconciliation。
Reconciliation在处理React的虚拟DOM时得到了广泛的应用。具体的来讲当我们渲染一个React页面的时候，一颗描述这个页面的节点树会在内存中被创建。这颗节点树最后会被实际渲染到环境中--
对于浏览器来说，就是转换到DOM当中。当页面更新时（例如使用了setState），React会创建一颗新的树，并且比对这两个颗树不同的地方，进行更新。   
总的来说，Reconciliation会找出两颗树不同的部分进行重新构建，对于相同的部分则直接复用（alternate)。  
这里有两个关键点:
- 对于类型不同的组件(例如div和span),React不会尝试比较它们细微的差距，而是直接创建新节点。
- 对于列表项，使用key是非常有必要的。

*Scheduler*  
Scheduler(调度器)会定义进程中操作的优先级。在React有关设计原则的文档中有这么一段话。
> In its current implementation React walks the tree recursively and calls render functions of the whole updated 
> tree during a single tick. However in the future it might start delaying some updates to avoid dropping frames.  
> This is a common theme in React design. Some popular libraries implement the "push" approach where computations 
> are performed when the new data is available. React, however, sticks to the "pull" approach where computations can 
> be delayed until necessary.  
> React is not a generic data processing library. It is a library for building user interfaces. We think that it is 
> uniquely positioned in an app to know which computations are relevant right now and which are not.  
> If something is offscreen, we can delay any logic related to it. If data is arriving faster than the frame rate, we 
> can coalesce and batch updates. We can prioritize work coming from user interactions (such as an animation caused 
> by a button click) over less important background work (such as rendering new content just loaded from the network)
> to avoid dropping frames.   

这段话的核心要点是：
- 在一个UI界面当中，不是所有更新都需要被立即应用，这样做是一种性能浪费，会造成掉帧，进而影响用户体验。
- 不同的更新应该拥有不同的优先级，例如一帧动画的更新应该比数据仓库的更新更优先执行。
- 推送式方法（Push-based)需要app开发者管理调度和更新的决策，拉取式方法（Pull-based）允许框架（React）以更智能的方式进行调度。  

### 什么是Fiber
让我们回到Fiber本身，我们要实现这么几个基本目标：
* 使作业能够被暂停，并在一段时间后继续
* 对不同的作业实现优先级的区分
* 尽可能复用之前已经完成的作业
* 删除不需要的作业

为了达成上述的目标，我们需要把作业划分成一个一个单元。  
通常情况下，计算机追踪程序调用是通过call stack（执行栈）实现的，当我们调用一个函数的时候，会在call stack中压入一个stack frame。 
但对于UI界面来说，有一个问题是当需要执行的任务太多的时候会造成页面掉帧，看起来就会觉得卡顿。而在这些任务当中，有些任务并不是必须要求及时执行的，于是我们就会想
能不能推迟部分任务来保证帧数不减少。  
在现代浏览器当中有一些API来帮助解决调度问题。`requestIdleCallback`注册对应的任务，告诉浏览器这些任务的优先级不高，可以在空闲的时候执行。
`requestAnimationFrame`注册一些高优先级的任务，需要在下一帧内执行。但问题在于，想哟应用这些API，我们必须想一个办法把渲染任务分割成不同的单元以便于暂停。否则浏览器只会清空call stack中的任务。  
这就是Fiber的重要意义所在，我们可以将Fiber看作一种**虚拟的执行单元（virtual stack frame)**，这种做法的优点是让执行任务能够暂停，并且在稍后恢复。
Fiber也可以看作**一种数据结构**  
具体的来说，fiber是一种记录了组件信息的JavaScript对象，它们既和stack frame相似，也有点像一个组件的示例，以下列举一些fiber上的重要字段。
`type`和`key`  
`type`描述组件的类型，对于合成组件,`type`是它本身或者一个类。对于原生标签(div,span等)，`type`是一个字符串。
伴随着`type`，`key`会在reconciliation阶段辅助判断哪些部分是可以被复用的。

`child`和`sibling`  
如图（等待补充）

`pendingProps` 和 `memoizedProps`
一个 fiber 的 `pendingProps` 会在其执行开始时被设置，而 `memoizedProps` 会在执行结束时被设置。

当传入的 `pendingProps` 与 `memoizedProps` 相等时，表明可以重用该 fiber 的前一次输出，从而避免不必要的工作

`pendingWorkPriority`  
记录fiber的优先级，越大的值代表更低的优先级

`alternate`
`flush`
将一个 fiber "flush" 意味着将其输出渲染到屏幕上。

`work-in-progress`
一个尚未完成的 fiber，概念上类似于一个尚未返回的栈帧。
在任何时候，一个组件实例最多有两个对应的 fiber：当前的、已完成的 fiber，以及 work-in-progress fiber。

当前 fiber 的 `alternate` 是 work-in-progress，work-in-progress 的 `alternate` 是当前 fiber。

一个 fiber 的 `alternate` 是通过一个名为 `cloneFiber` 的函数按需创建的。
cloneFiber 不会总是创建一个新对象，而是会尝试重用已存在的 alternate，从而尽量减少分配。

### 总结
Fiber是React16里面一个伟大的更新，为性能优化和用户体验做出了巨大的贡献。Fiber里面还有很多概念，例如双缓冲的实现，调度器的工作细节等，我可能会在后续过程中进行补充。
