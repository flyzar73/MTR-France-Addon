package fr.mtrfranceaddon.registry;

import fr.mtrfranceaddon.Constants;
import org.mtr.mapping.holder.Block;
import org.mtr.mapping.holder.Item;
import org.mtr.mapping.holder.ItemSettings;
import org.mtr.mapping.registry.BlockRegistryObject;
import org.mtr.mapping.registry.CreativeModeTabHolder;
import org.mtr.mapping.registry.ItemRegistryObject;
import org.mtr.mapping.registry.Registry;

import java.util.function.Function;
import java.util.function.Supplier;

public class MTRFranceAddonRegistry {

    public static final Registry REGISTRY = new Registry();

    public static void register() {
        // Here you call methods to register blocks, items...
        // Example: ModBlocks.register();
        // Example: ModItems.register();
        ModBlocks.register();
        Events.register();
        ModItems.register();
        Networking.register();
        BlockEntities.register();

        // Initialize the registry after adding everything.
        REGISTRY.init();
    }

    /**
     * Register a simple block with an associated item.
     * @param id Identifier of the block (ex: "example_block")
     * @param supplier The constructor of the block (ex: () -> new Block(BlockSettings.of()))
     * @param itemGroup The Creative tab where the item will appear
     * @return The block's object registered.
     */
    public static BlockRegistryObject registerBlockWithItem(String id, Supplier<Block> supplier, CreativeModeTabHolder itemGroup) {
        return REGISTRY.registerBlockWithBlockItem(Constants.id(id), supplier, itemGroup);
    }

    /**
     * Register a simple item.
     * @param id Identifier of the item (ex: "example_item")
     * @param callback The constructor of the item
     * @param itemGroup The creative tab where the item will appear
     * @return The item's object registered.
     */
    public static ItemRegistryObject registerItem(String id, Function<ItemSettings, Item> callback, CreativeModeTabHolder itemGroup) {
        return REGISTRY.registerItem(Constants.id(id), callback, itemGroup);
    }

}
