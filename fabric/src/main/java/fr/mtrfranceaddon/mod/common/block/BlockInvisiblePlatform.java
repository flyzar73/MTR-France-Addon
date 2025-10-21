package fr.mtrfranceaddon.mod.common.block;

import org.mtr.mapping.holder.BlockRenderType;
import org.mtr.mapping.holder.BlockSettings;
import org.mtr.mapping.holder.BlockState;
import org.mtr.mod.block.BlockPlatform;

public class BlockInvisiblePlatform extends BlockPlatform  {

    public BlockInvisiblePlatform(BlockSettings settings, boolean isIntended) {
        super(settings.nonOpaque(), isIntended);
    }

    public BlockRenderType getRenderType(BlockState state) {
        return BlockRenderType.INVISIBLE;
    }

}
