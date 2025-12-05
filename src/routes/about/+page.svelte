<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
</script>

<div class="space-y-6 max-w-3xl">
	<div>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
			About ThriveQuest
		</h1>
		<p class="text-gray-600 dark:text-gray-400">
			Your daily companion for building lasting wellness habits
		</p>
	</div>

	<Card>
		<div class="space-y-6">
			<section class="space-y-3">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
					What is ThriveQuest?
				</h2>
				<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
					ThriveQuest is a simple, focused app designed to help you build sustainable daily habits across the five pillars of well-being: Positive Emotion, Engagement, Relationships, Meaning, and Accomplishment (PERMA).
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
					The 5-out-of-7 Principle
				</h2>
				<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
					We believe in sustainable progress, not perfection. Our approach is simple: complete at least one quest on 5 out of 7 days each week. This creates consistency while allowing flexibility for life's inevitable interruptions.
				</p>
			</section>

			<section class="space-y-3">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
					How It Works
				</h2>
				<ul class="space-y-2 text-gray-700 dark:text-gray-300">
					<li class="flex items-start gap-3">
						<span class="text-primary text-xl">✓</span>
						<span>Choose from daily quests in different wellness domains</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-primary text-xl">✓</span>
						<span>Complete at least one quest each day</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-primary text-xl">✓</span>
						<span>Track your progress with the visual calendar</span>
					</li>
					<li class="flex items-start gap-3">
						<span class="text-primary text-xl">✓</span>
						<span>Aim for 5 days per week to build lasting habits</span>
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
					The PERMA Framework
				</h2>
				<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
					Based on positive psychology research, PERMA represents five essential elements of well-being:
				</p>
				<ul class="space-y-2 text-gray-700 dark:text-gray-300">
					<li><strong class="text-gray-900 dark:text-gray-100">Positive Emotion</strong> - Experiencing joy, gratitude, and contentment</li>
					<li><strong class="text-gray-900 dark:text-gray-100">Engagement</strong> - Finding flow in activities that challenge and absorb you</li>
					<li><strong class="text-gray-900 dark:text-gray-100">Relationships</strong> - Building meaningful connections with others</li>
					<li><strong class="text-gray-900 dark:text-gray-100">Meaning</strong> - Connecting to something larger than yourself</li>
					<li><strong class="text-gray-900 dark:text-gray-100">Accomplishment</strong> - Pursuing goals and experiencing mastery</li>
				</ul>
			</section>
		</div>
	</Card>
</div>