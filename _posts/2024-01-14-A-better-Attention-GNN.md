---
layout: post
title: "A better Attention GNN"
categories: misc
---

github link : https://github.com/profLepton/TransformerGNN/

So while paying "attention" ;) to my Graph machine learning class, I came up with a couple of ideas that sounded fun. 

The first of these ideas is the Attention based Graph neural network. The most popular version of Attention based Graph neural networks, the GAT (Graph Attention Network), works like this. Get the node states of a batch of neighbors. Let them attend to each other, and then have them output the updated node vectors. 

I feel that this approach has a lot of wasted potential, for many reasons : 

1) The more iterations you do, the farther the node vectors goes from the initial feature vector. You shouldn't start losing your feature information.

2) We're not leveraging our knowledge of the graph's topology to its fullest. The sampling of a neighborhood gives a vague understanding of what nodes are close, but not the exact structure.

3) The way you sample the neighborhoods can greatly affect how the nodes are updated.


I've a simple issue to these problems.

# Use all of the nodes in the graph at once! 

Take all of the nodes, have them attend to every other node at the same time! Wouldn't that get confusing for the model? yes if it were just that it would. You'd need to *mask* the attention with the adjacency matrix of the graph. So that any nodes not connected to one another directly, wouldn't be able to attend to each other. 

After just a single pass of this layer, you have every node having communicated to every other node, with no need for sampling, batching etc. Most GPU's can handle sizes of tens of thousands of nodes in a single pass like this. At most you would need 10 splits for datasets in the order of millions, and there are many ways to overcome this e.g using multiple gpus.

# What if you need more communicatoin? Need nodes to communicated on the second order?

So the simple way is to repeat the layer again. Having two layers masked by the adjacency matrix allows for second order communication.
This is pretty cool if I say so myself. 

The even cooler way of doing this is to square the adjacency matrix. When you square the adjacency matrix, all the non zero terms are part of the second order neighborhood of a node. Using this masking, you have direct second order communication.



The code is still a work in progress, please feel free to correct me at any point, any feedback is appreciated and welcome.
