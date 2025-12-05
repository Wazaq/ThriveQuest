<script lang="ts">
	type ButtonVariant = 'primary' | 'secondary' | 'ghost';
	type ButtonSize = 'sm' | 'md' | 'lg';

	interface Props {
		variant?: ButtonVariant;
		size?: ButtonSize;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: () => void;
		children?: any;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		type = 'button',
		onclick,
		children
	}: Props = $props();

	const baseClasses = 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';

	const variantClasses = {
		primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm hover:shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed',
		secondary: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm',
		ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
	};

	const sizeClasses = {
		sm: 'px-3 py-2 text-sm',
		md: 'px-6 py-3 text-base',
		lg: 'px-8 py-4 text-lg'
	};

	const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
</script>

<button
	{type}
	{disabled}
	class={classes}
	on:click={onclick}
>
	{@render children?.()}
</button>
