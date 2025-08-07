package fr.mtrfranceaddon.block;

import fr.mtrfranceaddon.block.base.MTRFranceAddonBlock;
import org.mtr.mapping.holder.BlockSettings;

public class LogoBlock extends MTRFranceAddonBlock {

    /**
     * The constructor contains only the properties of the block (material, durability...)
     * @param settings Properties of the bloc
     */
    public LogoBlock(BlockSettings settings) {
        super(settings);
    }

    // Here you can add different methods if the block has a special behaviour
    // Example: createBlockEntity(), onUse()...

}
