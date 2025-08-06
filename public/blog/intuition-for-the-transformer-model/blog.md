# Intuition for the Transformer Model

## Introduction

I was first introduced to the transformer model when I was listening to [Andrej Karpathy on the Lex Friedman Podcast](https://www.youtube.com/watch?v=cdiD-9MMpb0). Karparthy made it clear that after the transformer with the attention concept was introduced in [Attention is All You Need](https://arxiv.org/abs/1706.03762) by researchers at Google in 2017, the entire field has shifted to adopt it for almost all AI endeavors. I rushed to understand how the transformer worked. Personally, I found most of the representations of the transformer to be unnecessarily complicated. While they were imperative and technically correct, they didn’t capture the motivations and intuition for a great visual interpretation.

![*Transformer architecture diagram from Attention is All You Need*](/blog/intuition-for-the-transformer-model/transformer-architecture.png){ width=50% }

My goal was to create a simple yet adequately representative visualization of the transformer that I could understand and share. This guide will break down the intuition for the three major unique steps in the transformer with specific visuals and then put it all together.

## Input Embedding

The transformer as a whole is a reasoning engine. If the transformer works with words, it is a verbal reasoning engine. To reason with words mathematically, we must represent them in a way that we can do mathematical operations on. For this, we use what is called an _embedding_.

![*Word embedding visualization*](/blog/intuition-for-the-transformer-model/word-embeddings.png)

In a transformer, an embedding of a word (sometimes sub-word) is represented by a vector. These embeddings can be visualized in a coordinate space with all possible words floating around, each with specific coordinates. A transformer’s goal is to predict the next word in a document of text. This is accomplished by training the transformer across a set of these document examples. Before training, the transformer will assign each word in its vocabulary a random embedding (vector). During the training, the transformer will attempt to predict the next word in the sentence. As it does this, the transformer will adjust the embedding vector for each word such that the embedding vectors of semantically similar words are oriented close to each other in space. For example, in the figure above, we see that all the words are pointing to random directions in space. After training the transformer, we might observe that vectors representing the words “loud”, “bark” and “dog” are clustered together and pointing in similar directions.

If you want to explore one such embedding on your own, definitely check out the [TensorFlow Embedding projector visualization](https://projector.tensorflow.org/).

## Positional Encoding

Embedding the words of a sentence as vectors presents an issue. When the transformer performs the embedding, it loses sense of how the words were originally ordered in the sentence. It would be like trying to read a completely shuffled document. To encode the positional information into each vector, an initial approach would be to add another number to each vector as a label of the index of its position in the input.

It turns out that this is not as efficient for the model to learn. When there are large sequences, the index can grow very large and cause training issues. If the index is normalized between 0 and 1 then the index is different for different lengths of inputs.

The researchers at google brain cleverly solved this problem in [Attention Is All You Need](https://arxiv.org/abs/1706.03762). Each vector instead gets perturbed depending on its position in the input. The perturbations are in such a way that the model can pick up the distance between words in the original input by checking the difference between the perturbations (usually the frequency).

![*Positional encoding perturbations*](/blog/intuition-for-the-transformer-model/pixles-as-cards.png)

The intuition for the perturbations is as shown in the image. Imagine that you were given each pixel from an image as a shuffled stack of cards. It would be a challenge to try to put them all back in the right places, like a puzzle. If you perturb the color of each pixel in a specific pattern and keep reusing the same pattern for all images, the model will be able to learn the pattern. It will then be much easier to place all of the pixels in the correct locations.

![*Positional encoding perturbations*](/blog/intuition-for-the-transformer-model/positional-movement.png)

The same is true for textual inputs. The vector embedding of each word is shifted to different locations based on where it is in the input. In the image, you can see that the words gain an ordering while also keeping a subdued and offset version of their original offset from the origin. Since the positional encoding perturbations are the same in every training example, the model learns to determine the distance between words by comparing their distances.

## Multi-Headed Attention

The secret sauce for the transformer is what is called the attention mechanism. The best way to think of this process is that we are going to take each embedded word and move it toward a spot that represents what that word means in the particular context of the sentence. To visualize this, we will go through its steps using the following example sentence.

_**The animal didn’t cross the street because it was too tired.**_

To simplify the example, we will only calculate the attention encoding or true meaning for the word “it” and have it pay attention or use the context clues from only the words “tired” and “animal”.

For each attention head, we will make three separate linear transformations learned by the model on the entire sentence to create three sets of vectors called the queries, keys, and values. Think of these as

![*Attention mechanism*](/blog/intuition-for-the-transformer-model/attention-mechanism.png)

- **Query → What is one interpretation of this word?**
- **Key → What is one way this word can be used as context?**
- **Value → If the interpretation matches the context, what does the original word mean/refer to?**

In the transformations on the left part of the image, we compare the word “it” to both “tired” and “animal” for context. The keys for both “tired” and “animal” are found using a single transformation (notice how they moved the same amount and direction). The angle between the query for “it” is compared to both keys. A small angle means that the value vector associated with the key (right image) is a good representation of the word given the context. For this attention head, “it” will be pulled toward each value representation based on how well its key matched the query. The resulting output is a new position for the word “it” that encodes one way to interpret its meaning given the placement of the other words.

![*Attention head example*](/blog/intuition-for-the-transformer-model/attention-head-example.png)

With multiple attention heads, each one can pick up on a different representation of what “it” means in the sentence. The results of all of the heads are integrated together with a linear layer. Here is an example of a second attention head where it picks that “it” could possibly be an “animal subject”.

## Encoder-Decoder

Now we will put these concepts together. The transformer uses an encoder-decoder model. Here is how it would work with a familiar ChatGPT example using this question prompt.

![*Transformer encoder-decoder example*v](/blog/intuition-for-the-transformer-model/transformer-encoder-decoder-example.png)

The question is run through the encoder to create an internal representation of what the question is asking. The decoder will take in what the model has said so far and combine it with the representation of the question from the encoder to create the output. For each training example, the correct output will be the next word in the sentence. To generate a complete sentence answer, the transformer has to be rerun for each word since you need the output for the next word’s input.

![*Transformer encoder-decoder example with attention*](/blog/intuition-for-the-transformer-model/transformer-encoder-decoder-example-with-attention.png)

Now to truly put it all together, we will use the intuitions built from the previous sections. The encoder creates its internal representation of the question by first embedding the words as vectors. The positional encoding is added to the vectors, moving them to a place where the model can interpret the original order. This is denoted as a number on each vector in the image to show that the model understands the order.

The encoder then runs self-attention on the question with multiple heads. For each head, each word vector looks at each other word and gets moved toward a better representation of itself given the existence and placement of the other words. The model does a final feed-forward step or a non-linear transformation to fully predict the meaning of each word. Often the input will go through multiple encoders before being passed to the decoder.

The decoder applies similar steps to the part of the answer said so far. The words are embedded, and the positional information is encoded. The model applies self-attention for each word to look at the other words in what was said so far to add their contextual information relative to each other. After that, the decoder takes the words that have been said so far and has them pay attention to the representation from the encoder. The words in the output move toward spots that represent what they mean in the context of the question. A final learned feed-forward transformation is applied to move them toward an even better representation. Multiple decoders are usually used as well, all utilizing the same output from the last encoder. The model finally converts the decoder representation to the probabilities for all words in its vocabulary being next. The one with the highest probability is picked.

## Conclusion

I hope this has given you a good understanding of how the transformer works. I believe that the best explanations are those that make you feel like you could have discovered the concept on your own. This is by no means a comprehensive explanation, and if you want to learn more about the implementation and each step in more detail, I recommend reading [The Illustrated Transformer by Jay Alammar](http://jalammar.github.io/illustrated-transformer/). Please feel free to email me any feedback this article. I would love to hear from you.

## Resources and Links

- [Andrej Karpathy: Tesla AI, Self-Driving, Optimus, Aliens, and AGI | Lex Fridman Podcast #333](https://www.youtube.com/watch?v=cdiD-9MMpb0)
- [Attention is All You Need](https://arxiv.org/abs/1706.03762)
- [Embedding projector](https://projector.tensorflow.org/)
- [A Gentle Introduction to Positional Encoding in Transformer Models, Part 1 - MachineLearningMastery.com](https://machinelearningmastery.com/a-gentle-introduction-to-positional-encoding-in-transformer-models-part-1/)
- [ChatGPT - OpenAI](https://openai.com/blog/chatgpt)
- [The Illustrated Transformer – Jay Alammar](http://jalammar.github.io/illustrated-transformer/)
