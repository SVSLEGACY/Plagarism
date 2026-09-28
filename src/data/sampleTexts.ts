export interface SamplePreset {
  id: string;
  name: string;
  tag: string;
  estimatedSimilarity: string;
  description: string;
  title: string;
  content: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'academic-mixed',
    name: 'Academic Essay (Mixed Similarity ~34%)',
    tag: 'Academic',
    estimatedSimilarity: '34%',
    description: 'Contains authentic analysis interspersed with copied sections from Alan Turing and Wikipedia.',
    title: 'The Evolution of Cognitive Computing and Neural Architecture',
    content: `Artificial intelligence has undergone a fundamental paradigm shift over the past two decades. Computing systems are no longer merely deterministic rule engines following rigid heuristics. Instead, modern machine learning systems deduce internal representations directly from multidimensional feature vectors.

Computing machinery and intelligence begins with the question: Can machines think? If we wish to consider whether machines can think, we should first define the meaning of the terms 'machine' and 'think'. Turing proposed replacing this question with an operational test called the imitation game. In this game, an interrogator in a separate room attempts to distinguish between a human and a computer through written conversational exchanges.

Deep learning architectures, particularly the Transformer model introduced in 2017, rely on multi-head self-attention mechanisms to dispense with recurrent connections. Attention mechanisms allow modeling of dependencies without regard to their distance in the input or output sequences. In contrast to convolutional networks, attention calculates pairwise similarity matrix representations across the full token sequence.

Our empirical investigation into sparse gradient approximations demonstrates that parameter quantization can reduce memory consumption by 42% while retaining 98.4% top-1 accuracy on common linguistic benchmarks. However, researchers must remain vigilant regarding catastrophic forgetting when adapting foundational checkpoints to specialized clinical ontologies.`
  },
  {
    id: 'tech-high',
    name: 'Tech Article (High Plagiarism ~76%)',
    tag: 'Critical Risk',
    estimatedSimilarity: '76%',
    description: 'Copied almost verbatim from prominent technology publications and open knowledge repositories.',
    title: 'Understanding Blockchain Consensus Protocols',
    content: `A blockchain is a distributed ledger with growing lists of records (blocks) that are securely linked together via cryptographic hashes. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data. The timestamp proves that the transaction data existed when the block was published in order to get into its hash.

Because blocks each contain a timestamp and information linking them to the previous block, they form a chain, with each additional block reinforcing the ones before it. Therefore, blockchains are resistant to the modification of their data because once recorded, the data in any given block cannot be altered retroactively without altering all subsequent blocks.

Proof of work is a form of cryptographic zero-knowledge proof in which one party proves to others that a certain amount of a specific computational effort has been expended. Verifiers can subsequently confirm this expenditure with minimal effort on their part. The concept was invented by Cynthia Dwork and Moni Naor in 1993 as a way to deter denial-of-service attacks and other service abuses such as spam on a network.`
  },
  {
    id: 'original-research',
    name: 'Original Research Abstract (~2% Original)',
    tag: 'Clean / Safe',
    estimatedSimilarity: '2%',
    description: 'Novel, student-authored research abstract with rigorous original language and custom findings.',
    title: 'Autonomous Drone Navigation in GPS-Denied Canopy Environments',
    content: `We introduce AeroBorealis, an ultra-low-power optical flow navigation stack tailored specifically for micro-aerial vehicles maneuvering beneath dense temperate forest canopies where global positioning signals suffer complete attenuation. Our architecture decouples spatial localization into two asynchronous threads: a 120-Hz bio-inspired neuromorphic event sensor tracker that resolves micro-vibrations and branch proximity, and a 15-Hz sub-graph stereo disparity solver optimized for embedded RISC-V co-processors.

Across sixty-four field deployment trials in Olympic National Park, our prototype maintained continuous collision-free flight paths through sub-meter branch apertures at transit velocities exceeding 4.2 meters per second. Cumulative trajectory drift was constrained within 0.18 meters per hundred meters of transit, representing a 3.4-fold precision improvement over traditional visual-inertial odometry baselines under dappled sunlight conditions. All hardware designs, embedded C++ kernels, and telemetry datasets are made freely available for reproducible robotics research.`
  },
  {
    id: 'paraphrased-literature',
    name: 'Literature Review (Paraphrased ~48%)',
    tag: 'Paraphrased',
    estimatedSimilarity: '48%',
    description: 'Spun and subtly rewritten sentences derived from published energy economics journals without quotation marks.',
    title: 'Global Energy Transitions and Photovoltaic Grid Integration',
    content: `The worldwide switch toward clean power solutions is picking up rapid momentum due to plunging production expenses for silicon photovoltaic modules. Over the previous decade, the levelized expense of photovoltaic power generation has plunged by more than eighty percent, making solar energy competitively superior to conventional fossil thermal generation in most sun-rich latitudes.

Nevertheless, integrating high shares of fluctuating renewable resources presents formidable structural obstacles for conventional electricity transmission networks. Because generation output is dictated by atmospheric variations and solar irradiance cycles rather than peak consumer demand, grid controllers must deploy grid-scale battery repositories and adjustable demand-response protocols to avert transmission congestion and frequency instabilities. Consequently, regulatory frameworks must modernize dispatch compensation models to incentivize long-duration storage deployments.`
  }
];
